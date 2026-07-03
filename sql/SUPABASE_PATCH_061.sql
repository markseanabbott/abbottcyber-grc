-- SUPABASE_PATCH_061.sql
-- Tabletop Story Board — four content tables
-- tb_storyboard TB1: tt_stories, tt_inject_cards, tt_response_cards, tabletop_card_plays
-- Run in the Supabase SQL Editor.

-- ============================================================
-- 1. tt_stories — kickoff story pool
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tt_stories (
  id              text        PRIMARY KEY,
  archetype       text        NOT NULL,  -- 'ransomware'|'bec'|'insider'|'vendor_compromise'|'bcdr'
  track           text        NOT NULL,  -- 'ir'|'bcdr'|'exec'|'vendor'
  title           text        NOT NULL,
  opener_text     text        NOT NULL,
  business_context text,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tt_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_tt_stories"
  ON public.tt_stories FOR SELECT
  USING (true);

-- ============================================================
-- 2. tt_inject_cards — branching inject deck
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tt_inject_cards (
  id                  text        PRIMARY KEY,
  archetype           text        NOT NULL,
  track               text        NOT NULL,  -- 'ir'|'bcdr'|'exec'|'vendor'
  chain_stage         integer     NOT NULL,  -- ordering within the kill chain (1, 2, 3 …)
  requires            jsonb       NOT NULL DEFAULT '[]',  -- tags that must be in granted_tags before this card is eligible
  grants              jsonb       NOT NULL DEFAULT '[]',  -- tags added to granted_tags when this card is played
  weight              integer     NOT NULL DEFAULT 10,    -- higher = more likely to be picked
  title               text        NOT NULL,
  body                text        NOT NULL,
  role_prompts        jsonb       NOT NULL DEFAULT '{}',  -- keyed by role_id
  mitre_tactic        text,
  mitre_technique     text,
  correct_criticality text        CHECK (correct_criticality IN ('Critical','High','Medium','Low')),
  nist_phase_idx      integer,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tt_inject_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_tt_inject_cards"
  ON public.tt_inject_cards FOR SELECT
  USING (true);

CREATE TRIGGER tg_tt_inject_cards_updated_at
  BEFORE UPDATE ON public.tt_inject_cards
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

-- ============================================================
-- 3. tt_response_cards — player action card library
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tt_response_cards (
  id              text        PRIMARY KEY,
  role_id         text        NOT NULL,  -- 'ic'|'tl'|'cl'|'lc'|'es'
  nist_phase      text        NOT NULL,  -- 'detect'|'analyze'|'contain'|'eradicate'|'recover'
  track           text        NOT NULL DEFAULT 'ir',
  scenario_types  jsonb       NOT NULL DEFAULT '[]',  -- archetypes this card applies to; empty = all
  title           text        NOT NULL,
  body            text        NOT NULL,
  appropriateness jsonb       NOT NULL DEFAULT '{}',
  -- appropriateness shape: { "<archetype>:<nist_phase>": "correct"|"defensible-partial"|"inappropriate"|"not-applicable" }
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tt_response_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_tt_response_cards"
  ON public.tt_response_cards FOR SELECT
  USING (true);

CREATE TRIGGER tg_tt_response_cards_updated_at
  BEFORE UPDATE ON public.tt_response_cards
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

-- ============================================================
-- 4. tabletop_card_plays — what each player actually played
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tabletop_card_plays (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid        NOT NULL REFERENCES public.tabletop_sessions(id) ON DELETE CASCADE,
  inject_index    integer     NOT NULL,
  role_id         text        NOT NULL,
  player_name     text,
  card_ids        jsonb       NOT NULL DEFAULT '[]',  -- array of tt_response_cards.id values played
  comment         text,
  appropriateness jsonb,  -- graded result: { card_id: 'correct'|'defensible-partial'|'inappropriate'|'not-applicable' }
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, inject_index, role_id)
);

ALTER TABLE public.tabletop_card_plays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_tabletop_card_plays"
  ON public.tabletop_card_plays FOR SELECT
  USING (true);

CREATE POLICY "anon_insert_tabletop_card_plays"
  ON public.tabletop_card_plays FOR INSERT
  WITH CHECK (true);

CREATE POLICY "anon_update_tabletop_card_plays"
  ON public.tabletop_card_plays FOR UPDATE
  USING (true);

CREATE TRIGGER tg_tabletop_card_plays_updated_at
  BEFORE UPDATE ON public.tabletop_card_plays
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

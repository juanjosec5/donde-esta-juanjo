-- Local dev seed. `supabase db reset` runs migrations then this file.

-- A test user (email: demo@trip.local / password: password)
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password,
   email_confirmed_at, created_at, updated_at,
   raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000000',
   '11111111-1111-1111-1111-111111111111',
   'authenticated', 'authenticated', 'demo@trip.local',
   crypt('password', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}')
on conflict (id) do nothing;

-- A published demo page (anon-readable) and a draft (anon must NOT see it).
insert into public.pages (owner_id, slug, occasion, locale, status, plan, target_at, published_at, config)
values
  ('11111111-1111-1111-1111-111111111111', 'demo', 'romantic', 'en',
   'published', 'paid', '2026-10-31T20:00:00-05:00', now(),
   jsonb_build_object(
     'meta', jsonb_build_object('slug','demo','locale','en','occasion','romantic','status','published','plan','paid'),
     'people', jsonb_build_object('away', jsonb_build_array(jsonb_build_object('name','Sam')),
                                  'home', jsonb_build_array(jsonb_build_object('name','you')),
                                  'whoIsAway','away'),
     'hero', jsonb_build_object('title', E'The long way\nback to you',
                                'subtitle','Where Sam is right now, and how long until we''re in the same place.'),
     'target', jsonb_build_object('at','2026-10-31T20:00:00-05:00','tz','America/Guayaquil',
                                  'placeName','Guayaquil','label','the arrivals gate',
                                  'dateLabel','31 October 2026', 'coords', jsonb_build_array(-2.19,-79.89),
                                  'onZero', jsonb_build_object('title','home','body','made it','confetti',true)),
     'entries', jsonb_build_array(
        jsonb_build_object('id','e0','dateStart','2026-09-01','dateEnd','2026-09-20','title','Lisbon','subtitle','Portugal','icon','🚋','kind','stay','body','Tiles, hills, coffee.','coords',jsonb_build_array(38.72,-9.14)),
        jsonb_build_object('id','e1','dateStart','2026-10-31','title','Guayaquil','subtitle','Ecuador','icon','💛','kind','reunion','body','You, finally.','coords',jsonb_build_array(-2.19,-79.89))
     ),
     'note', jsonb_build_object('body','Almost there. 💛'),
     'stats', jsonb_build_object('show', jsonb_build_array('distance','stopsLeft','percent')),
     'share', jsonb_build_object('ogAuto', true),
     'branding', jsonb_build_object('showFooter', false)
   )),
  ('11111111-1111-1111-1111-111111111111', 'draft-demo', 'romantic', 'en',
   'draft', 'free', null, null, '{}'::jsonb);

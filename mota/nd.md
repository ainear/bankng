# Master System Spec Full Scope cho nền tảng kiểu Nganhang.com

## 1. Mục tiêu tài liệu

Tài liệu này là system contract cấp implementation để đưa cho Codex, Claude Code hoặc đội dev nội bộ bắt đầu generate code theo từng app và từng domain. Hệ thống mục tiêu là một platform tài chính số gồm public web, admin backoffice, banker portal, data platform, calculators, content engine, lead engine và moderation engine, lấy cảm hứng từ cấu trúc sản phẩm đang hiện diện trên nganhang.com như so sánh sản phẩm, công cụ tính, danh sách banker, onboarding banker và dữ liệu lãi suất theo khu vực.nganhang+6

Mục tiêu của spec không phải mô tả UI chung chung, mà là khóa chặt phạm vi nghiệp vụ, bounded contexts, schema dữ liệu, state machines, API contracts, role matrix, module behavior và implementation order để AI coding agent không tự suy diễn sai kiến trúc.

## 2. Product vision

Xây một nền tảng fintech B2C + B2B2C cho phép:

- Người dùng cuối so sánh sản phẩm tài chính theo nhu cầu.
    
- Người dùng sử dụng các công cụ tính toán tài chính.
    
- Người dùng tìm và liên hệ banker phù hợp.
    
- Banker tạo hồ sơ công khai, xác thực thông tin và quản lý lead.
    
- Admin quản lý danh mục sản phẩm, lãi suất, nội dung, banker và quy trình moderation.
    
- Hệ thống tạo lợi thế qua data asset, lead routing, banker graph, content SEO và trust operations.
    

## 3. Scale filter bắt buộc

Trước mọi quyết định implementation, phải qua 4 câu hỏi:

1. Có scale không?
    
2. Có tiết kiệm thời gian tương lai không?
    
3. Có tự tạo giá trị khi founder dừng can thiệp không?
    
4. Có compound không?
    

Nếu dưới 2/4 câu trả lời là “có”, không được code ngay; phải thiết kế lại.

## 4. Product scope full

## 4.1 Public web

- Homepage.
    
- Compare category pages.
    
- Product detail pages.
    
- Bank detail pages.
    
- Rate by location pages.
    
- Community product/rate pages.
    
- Tool hub.
    
- Tool detail pages.
    
- Article hub.
    
- Article detail pages.
    
- Glossary pages.
    
- FAQ/landing pages.
    
- User auth pages.
    
- Contact/lead pages.
    

## 4.2 Banker portal

- Banker register/login.
    
- KYC upload.
    
- Banker profile builder.
    
- Public profile preview.
    
- Lead inbox.
    
- Lead status management.
    
- Basic performance dashboard.
    
- Notification center.
    

## 4.3 Admin backoffice

- Dashboard.
    
- Banks module.
    
- Branches module.
    
- Categories module.
    
- Products module.
    
- Variants module.
    
- Rates module.
    
- Rules & fees module.
    
- Tools module.
    
- SEO/content module.
    
- Banker moderation module.
    
- Community moderation module.
    
- Leads CRM module.
    
- Audit module.
    
- Analytics/reporting module.
    
- Settings module.
    

## 5. Non-goals cho bản đầu generate code

Không code các phần sau trong vòng generate đầu tiên trừ khi đã hoàn thành skeleton của các domain lõi:

- AI recommendation engine phức tạp.
    
- Credit scoring real-time.
    
- Open marketplace cho mọi user post dữ liệu.
    
- Chatbot tư vấn tự động quyết định sản phẩm.
    
- Native mobile app.
    
- Billing/subscription phức tạp.
    

## 6. Users và personas

## 6.1 Visitor

Người chưa đăng nhập, chủ yếu đọc compare pages, dùng tool, xem bài viết, tìm banker và gửi lead.

## 6.2 Registered user

Người dùng có account để lưu thông tin liên hệ, theo dõi yêu cầu tư vấn, nhận gợi ý và lịch sử công cụ.

## 6.3 Banker

Nhân viên ngân hàng hoặc chuyên gia tài chính có hồ sơ công khai, được xác thực, nhận lead và quản lý pipeline cơ bản.nganhang+2

## 6.4 Editor

Người phụ trách nội dung, landing pages, bảng sản phẩm và metadata SEO.

## 6.5 Ops admin

Người phụ trách rates, moderation, banker verification, lead routing và kiểm soát trust.

## 6.6 Super admin

Quản trị toàn hệ thống.

## 7. Business capabilities

## 7.1 Catalog capability

Quản lý ngân hàng, chi nhánh, categories, sản phẩm, biến thể, lợi ích, phí, điều kiện, hồ sơ yêu cầu.

## 7.2 Rates capability

Quản lý lãi suất, snapshot theo thời điểm, khu vực, nguồn, độ tin cậy, xác thực và lịch sử thay đổi.nganhang+1

## 7.3 Compare capability

Render compare pages theo category với bộ lọc, sort, ranking logic, badge, CTA, calculator hooks.

## 7.4 Calculator capability

Xây bộ công cụ tính tài chính như tính khoản vay tối đa, tính lãi vay, tính lợi tức tiết kiệm, eligibility checks.nganhang+2

## 7.5 Banker capability

Onboarding banker, KYC, public profile, availability, expertise, assigned leads, performance summary.

## 7.6 Lead capability

Capture lead từ mọi điểm chạm, định tuyến, SLA, note, follow-up, status, conversion outcome.

## 7.7 Content capability

Bài viết, cẩm nang, glossary, landing pages, FAQ, metadata và internal linking.

## 7.8 Community capability

Cho banker hoặc contributor đăng thông tin sản phẩm/lãi suất cộng đồng nhưng phải qua moderation trước khi publish.nganhang+1

## 7.9 Audit & trust capability

Lưu mọi thay đổi dữ liệu nhạy cảm, lịch sử review, nguồn rate, log moderation, log assignment.

## 8. App architecture

Monorepo đề xuất:

text

`/apps   /web  /admin  /banker  /api /packages   /ui  /db  /auth  /config  /analytics  /rules  /shared-types  /shared-utils /docs   /adr  /domain  /api`

## 8.1 apps/web

Chịu trách nhiệm public SEO pages, compare pages, article pages, tools, auth cơ bản, lead capture.

## 8.2 apps/admin

Chịu trách nhiệm CRUD dữ liệu, moderation, reporting, audit, settings.

## 8.3 apps/banker

Chịu trách nhiệm onboarding banker, profile management, lead management, notifications.

## 8.4 apps/api

BFF hoặc domain API layer để tách logic nghiệp vụ khỏi UI, đặc biệt hữu ích cho Codex/Claude Code nhằm tránh trộn server action với domain logic quá sớm.

## 9. Tech stack tiêu chuẩn

- Frontend framework: Next.js App Router.
    
- Language: TypeScript strict mode.
    
- DB: PostgreSQL.
    
- ORM: Prisma.
    
- Validation: Zod.
    
- Styling: Tailwind CSS + shared UI package.
    
- Auth: Auth.js hoặc custom auth với email/password + magic link về sau.
    
- Queue: BullMQ hoặc Trigger.dev.
    
- Cache: Redis cho queue và caching kết quả lọc/phổ biến.
    
- Storage: S3-compatible.
    
- Analytics: PostHog wrapper hoặc event abstraction nội bộ.
    
- Rich editor: TipTap/BlockNote hoặc editor JSON tương đương.
    
- Charts: lightweight chart library cho admin analytics.
    

## 10. Domain boundaries

## 10.1 Identity domain

Entities:

- User
    
- Role
    
- Permission
    
- Session
    
- UserProfile
    

## 10.2 Bank catalog domain

Entities:

- Bank
    
- Branch
    
- Region
    
- ProductCategory
    
- FinancialProduct
    
- ProductVariant
    
- ProductFee
    
- ProductBenefit
    
- EligibilityRule
    
- RequiredDocument
    

## 10.3 Rates domain

Entities:

- InterestRateSnapshot
    
- RateSource
    
- RateVerification
    
- RateChangeLog
    
- RegionalRate
    

## 10.4 Content domain

Entities:

- Article
    
- Author
    
- SeoPage
    
- GlossaryTerm
    
- FAQItem
    

## 10.5 Banker domain

Entities:

- Banker
    
- BankerProfile
    
- BankerVerification
    
- BankerCertificate
    
- BankerReview
    
- BankerAvailability
    

## 10.6 Leads domain

Entities:

- Lead
    
- LeadAssignment
    
- LeadEvent
    
- LeadNote
    
- Appointment
    
- ContactRequest
    

## 10.7 Community domain

Entities:

- CommunityRatePost
    
- CommunityProductPost
    
- ModerationReview
    
- AbuseReport
    

## 10.8 Tools domain

Entities:

- CalculatorDefinition
    
- CalculatorPreset
    
- CalculatorRun
    

## 10.9 Audit domain

Entities:

- AuditLog
    
- AdminAction
    
- NotificationLog
    

## 11. Foldering rules

Mỗi app phải organize theo domain feature, không organize thuần theo `components/`, `utils/`, `services/` kiểu flat.

Ví dụ cho `apps/admin`:

text

`src/   app/  modules/    banks/      components/      server/      schemas/      repositories/      services/      actions/      pages/    rates/    bankers/    leads/`

## 12. Database spec chi tiết

## 12.1 Identity tables

sql

`users(   id uuid pk,  email varchar unique not null,  phone varchar unique null,  password_hash varchar null,  status varchar not null, -- invited, active, suspended, deleted  email_verified_at timestamptz null,  created_at timestamptz not null,  updated_at timestamptz not null ) user_profiles(   user_id uuid pk references users(id),  full_name varchar not null,  avatar_url varchar null,  province_code varchar null,  date_of_birth date null,  gender varchar null,  created_at timestamptz not null,  updated_at timestamptz not null ) roles(   id uuid pk,  code varchar unique not null,  name varchar not null ) permissions(   id uuid pk,  code varchar unique not null,  name varchar not null ) role_permissions(   role_id uuid references roles(id),  permission_id uuid references permissions(id),  primary key(role_id, permission_id) ) user_roles(   user_id uuid references users(id),  role_id uuid references roles(id),  primary key(user_id, role_id) )`

## 12.2 Bank catalog tables

sql

`banks(   id uuid pk,  slug varchar unique not null,  name varchar not null,  short_name varchar null,  bank_type varchar null,  website_url varchar null,  hotline varchar null,  description text null,  logo_url varchar null,  is_active boolean not null default true,  created_at timestamptz not null,  updated_at timestamptz not null ) bank_branches(   id uuid pk,  bank_id uuid not null references banks(id),  province_code varchar not null,  district_code varchar null,  branch_name varchar not null,  address text null,  phone varchar null,  is_active boolean not null default true,  created_at timestamptz not null,  updated_at timestamptz not null ) product_categories(   id uuid pk,  slug varchar unique not null,  name varchar not null,  description text null,  compare_enabled boolean not null default true,  is_active boolean not null default true,  created_at timestamptz not null,  updated_at timestamptz not null ) financial_products(   id uuid pk,  bank_id uuid not null references banks(id),  category_id uuid not null references product_categories(id),  slug varchar unique not null,  name varchar not null,  short_description text null,  long_description text null,  status varchar not null, -- draft, active, archived  ranking_score numeric null,  featured_rank integer null,  is_public boolean not null default false,  created_at timestamptz not null,  updated_at timestamptz not null ) product_variants(   id uuid pk,  product_id uuid not null references financial_products(id),  slug varchar unique not null,  variant_name varchar not null,  target_segment varchar null,  min_amount numeric null,  max_amount numeric null,  min_term_month integer null,  max_term_month integer null,  collateral_required boolean null,  income_requirement text null,  note text null,  status varchar not null default 'active',  created_at timestamptz not null,  updated_at timestamptz not null ) product_fees(   id uuid pk,  product_variant_id uuid not null references product_variants(id),  fee_name varchar not null,  fee_type varchar not null,  fee_value numeric null,  fee_unit varchar null,  note text null,  created_at timestamptz not null ) product_benefits(   id uuid pk,  product_variant_id uuid not null references product_variants(id),  benefit_text text not null,  display_order integer not null default 0 ) eligibility_rules(   id uuid pk,  product_variant_id uuid not null references product_variants(id),  rule_group varchar not null,  rule_key varchar not null,  operator varchar not null,  rule_value varchar not null,  human_label varchar null,  created_at timestamptz not null ) required_documents(   id uuid pk,  product_variant_id uuid not null references product_variants(id),  document_name varchar not null,  is_required boolean not null default true,  note text null,  display_order integer not null default 0 )`

## 12.3 Rates tables

sql

`rate_sources(   id uuid pk,  source_type varchar not null, -- bank_official, banker_submitted, ops_verified, community  source_name varchar not null,  source_url varchar null,  reliability_score integer not null default 50,  created_at timestamptz not null ) interest_rate_snapshots(   id uuid pk,  product_variant_id uuid not null references product_variants(id),  branch_id uuid null references bank_branches(id),  province_code varchar null,  rate_type varchar not null, -- deposit, home_loan_intro, home_loan_after_intro, credit_card_fee, etc  term_value integer null,  term_unit varchar null,  rate_value numeric not null,  rate_unit varchar not null default 'percent_per_year',  min_amount numeric null,  max_amount numeric null,  effective_from date not null,  effective_to date null,  source_id uuid not null references rate_sources(id),  status varchar not null default 'pending', -- pending, verified, rejected, expired  created_by uuid not null references users(id),  created_at timestamptz not null,  updated_at timestamptz not null ) rate_verifications(   id uuid pk,  snapshot_id uuid not null references interest_rate_snapshots(id),  reviewer_id uuid not null references users(id),  review_status varchar not null, -- approved, rejected, needs_info  review_note text null,  reviewed_at timestamptz not null ) rate_change_logs(   id uuid pk,  snapshot_id uuid not null references interest_rate_snapshots(id),  previous_value numeric null,  new_value numeric not null,  changed_by uuid not null references users(id),  changed_reason text null,  created_at timestamptz not null )`

## 12.4 Banker tables

sql

`bankers(   id uuid pk,  user_id uuid not null unique references users(id),  bank_id uuid null references banks(id),  primary_branch_id uuid null references bank_branches(id),  slug varchar unique not null,  job_title varchar null,  years_experience integer null,  specialties text null,  bio text null,  avatar_url varchar null,  public_status varchar not null default 'draft', -- draft, review, approved, hidden, rejected  verification_status varchar not null default 'pending', -- pending, verified, rejected, more_info  is_accepting_leads boolean not null default true,  average_rating numeric null,  total_reviews integer not null default 0,  created_at timestamptz not null,  updated_at timestamptz not null ) banker_verifications(   id uuid pk,  banker_id uuid not null references bankers(id),  document_type varchar not null,  file_url varchar not null,  review_status varchar not null default 'pending',  review_note text null,  reviewer_id uuid null references users(id),  submitted_at timestamptz not null,  reviewed_at timestamptz null ) banker_availability(   id uuid pk,  banker_id uuid not null references bankers(id),  weekday integer not null,  start_time time not null,  end_time time not null,  is_active boolean not null default true ) banker_reviews(   id uuid pk,  banker_id uuid not null references bankers(id),  reviewer_user_id uuid null references users(id),  lead_id uuid null,  rating integer not null,  review_text text null,  status varchar not null default 'published',  created_at timestamptz not null )`

## 12.5 Community tables

sql

`community_rate_posts(   id uuid pk,  author_user_id uuid not null references users(id),  banker_id uuid null references bankers(id),  bank_id uuid not null references banks(id),  branch_id uuid null references bank_branches(id),  title varchar not null,  content text null,  province_code varchar null,  submitted_snapshot_id uuid null references interest_rate_snapshots(id),  moderation_status varchar not null default 'pending',  published_at timestamptz null,  created_at timestamptz not null,  updated_at timestamptz not null ) moderation_reviews(   id uuid pk,  entity_type varchar not null,  entity_id uuid not null,  reviewer_id uuid not null references users(id),  action varchar not null, -- approve, reject, request_edit, hide  note text null,  created_at timestamptz not null )`

## 12.6 Leads tables

sql

`leads(   id uuid pk,  full_name varchar not null,  phone varchar not null,  email varchar null,  province_code varchar null,  budget_amount numeric null,  requested_category_id uuid null references product_categories(id),  requested_product_id uuid null references financial_products(id),  requested_banker_id uuid null references bankers(id),  source_channel varchar not null,  source_page varchar null,  status varchar not null default 'new', -- new, assigned, contacted, qualified, won, lost, spam  priority varchar not null default 'normal',  consent_status varchar not null default 'granted',  created_at timestamptz not null,  updated_at timestamptz not null ) lead_assignments(   id uuid pk,  lead_id uuid not null references leads(id),  banker_id uuid null references bankers(id),  assigned_by uuid not null references users(id),  assignment_type varchar not null, -- manual, rule_based  assigned_at timestamptz not null ) lead_events(   id uuid pk,  lead_id uuid not null references leads(id),  actor_user_id uuid null references users(id),  event_type varchar not null,  payload jsonb null,  created_at timestamptz not null ) lead_notes(   id uuid pk,  lead_id uuid not null references leads(id),  author_user_id uuid not null references users(id),  note text not null,  is_internal boolean not null default true,  created_at timestamptz not null ) appointments(   id uuid pk,  lead_id uuid not null references leads(id),  banker_id uuid not null references bankers(id),  scheduled_at timestamptz not null,  meeting_type varchar not null,  meeting_url varchar null,  status varchar not null default 'scheduled',  created_at timestamptz not null )`

## 12.7 Content tables

sql

`authors(   id uuid pk,  user_id uuid null references users(id),  name varchar not null,  bio text null,  avatar_url varchar null,  created_at timestamptz not null ) articles(   id uuid pk,  slug varchar unique not null,  title varchar not null,  excerpt text null,  content_json jsonb not null,  cover_image_url varchar null,  author_id uuid null references authors(id),  status varchar not null default 'draft',  published_at timestamptz null,  created_at timestamptz not null,  updated_at timestamptz not null ) seo_pages(   id uuid pk,  page_type varchar not null,  entity_id uuid null,  slug varchar unique not null,  title_tag varchar not null,  meta_description text null,  canonical_url varchar null,  robots varchar null,  schema_json jsonb null,  is_indexable boolean not null default true,  updated_at timestamptz not null ) glossary_terms(   id uuid pk,  slug varchar unique not null,  term varchar not null,  definition text not null,  content_json jsonb null,  status varchar not null default 'draft',  created_at timestamptz not null,  updated_at timestamptz not null )`

## 12.8 Tools tables

sql

`calculator_definitions(   id uuid pk,  slug varchar unique not null,  name varchar not null,  calculator_type varchar not null,  input_schema jsonb not null,  formula_config jsonb not null,  result_schema jsonb not null,  is_active boolean not null default true,  created_at timestamptz not null,  updated_at timestamptz not null ) calculator_runs(   id uuid pk,  calculator_id uuid not null references calculator_definitions(id),  user_id uuid null references users(id),  anonymous_id varchar null,  input_payload jsonb not null,  result_payload jsonb not null,  source_page varchar null,  created_at timestamptz not null )`

## 12.9 Audit and analytics tables

sql

`audit_logs(   id uuid pk,  actor_user_id uuid not null references users(id),  entity_type varchar not null,  entity_id uuid not null,  action varchar not null,  before_json jsonb null,  after_json jsonb null,  created_at timestamptz not null ) analytics_events(   id uuid pk,  anonymous_id varchar null,  user_id uuid null references users(id),  app_name varchar not null,  event_name varchar not null,  page_url varchar null,  referrer varchar null,  payload jsonb null,  created_at timestamptz not null )`

## 13. State machines

## 13.1 Banker verification state machine

text

`pending -> more_info -> pending pending -> verified pending -> rejected more_info -> rejected verified -> hidden hidden -> verified`

Rules:

- Chỉ ops admin hoặc super admin mới chuyển trạng thái verification.
    
- Mọi chuyển trạng thái đều phải có moderation review log.
    
- Banker chỉ public khi `verification_status=verified` và `public_status=approved`.
    

## 13.2 Community moderation state machine

text

`pending -> approved -> published pending -> rejected pending -> request_edit -> pending published -> hidden hidden -> published`

## 13.3 Lead state machine

text

`new -> assigned assigned -> contacted contacted -> qualified qualified -> won qualified -> lost new -> spam assigned -> spam contacted -> lost won -> archived lost -> archived`

Rules:

- Lead khi submit luôn sinh `lead_event=lead_created`.
    
- Khi assign phải sinh `lead_assignment` + `lead_event=lead_assigned`.
    
- Banker chỉ update được lead được assign cho mình.
    
- Admin có thể override mọi lead status.
    

## 13.4 Product publish state machine

text

`draft -> review review -> active review -> draft active -> archived archived -> active`

## 14. Permission model

## 14.1 Roles

- `super_admin`
    
- `ops_admin`
    
- `editor`
    
- `banker`
    
- `viewer`
    

## 14.2 Permission groups

- `banks.read`, `banks.write`
    
- `products.read`, `products.write`, `products.publish`
    
- `rates.read`, `rates.write`, `rates.verify`, `rates.import`
    
- `bankers.read`, `bankers.write`, `bankers.verify`
    
- `community.read`, `community.moderate`
    
- `leads.read`, `leads.assign`, `leads.update`, `leads.export`
    
- `content.read`, `content.write`, `content.publish`
    
- `audit.read`
    
- `settings.write`
    

## 14.3 Role mapping

- `super_admin`: tất cả permissions.
    
- `ops_admin`: tất cả trừ settings/global secrets.
    
- `editor`: content + products read/write + limited SEO.
    
- `banker`: own profile, own leads, own verification uploads.
    
- `viewer`: read-only selected dashboards.
    

## 15. Public web pages spec

## 15.1 Homepage

Sections bắt buộc:

- Hero.
    
- Category shortcuts.
    
- Featured compare tables.
    
- Calculator hub teaser.
    
- Banker spotlight.
    
- Community rates teaser.
    
- Article/news section.
    
- Footer trust/legal.
    

Primary CTAs:

- Compare now.
    
- Calculate now.
    
- Connect banker.
    

## 15.2 Compare category page

Features:

- Sticky filter bar.
    
- Sort by rate, fees, popularity, updated_at.
    
- Desktop compare table.
    
- Mobile stacked cards.
    
- CTA block cho calculator.
    
- Lead capture form.
    
- FAQ.
    
- SEO schema.
    

## 15.3 Product detail page

Features:

- Hero summary.
    
- Key stats.
    
- Eligibility section.
    
- Fees section.
    
- Documents section.
    
- Rate timeline if available.
    
- Related products.
    
- Contact banker CTA.
    

## 15.4 Banker directory

Features:

- Search by name.
    
- Filter by bank, province, specialty, accepting leads.
    
- Sort by rating, recency, featured.
    
- Pagination.
    

## 15.5 Banker public profile

Features:

- Profile header.
    
- Verification badge.
    
- Bank and branch.
    
- Areas served.
    
- Specialties.
    
- Reviews.
    
- Contact CTA.
    

## 15.6 Tool page

Features:

- Intro copy.
    
- Input form.
    
- Real-time result section.
    
- CTA to submit lead.
    
- Related products.
    
- FAQ.
    

## 15.7 Article page

Features:

- Title, author, publish date.
    
- TOC.
    
- Related articles.
    
- CTA modules contextually inserted.
    

## 16. Admin app modules spec

## 16.1 Dashboard

Widgets:

- Leads by status.
    
- Rates updated today.
    
- Pending banker verifications.
    
- Pending moderation items.
    
- Top pages by conversions.
    
- Stale data alerts.
    

## 16.2 Banks module

Capabilities:

- List/search/filter banks.
    
- Create/update bank.
    
- Toggle active state.
    
- Manage branches.
    

## 16.3 Products module

Capabilities:

- Manage categories.
    
- Manage products and variants.
    
- Attach fees, benefits, rules, documents.
    
- Preview public rendering.
    
- Publish workflow.
    

## 16.4 Rates module

Capabilities:

- Table view.
    
- Inline edit.
    
- Bulk CSV import.
    
- Verify/reject snapshot.
    
- View change history.
    
- Filter by bank/category/province/status/date.
    

## 16.5 Bankers module

Capabilities:

- List/search bankers.
    
- View submitted documents.
    
- Approve/reject/more_info.
    
- Toggle profile visibility.
    
- View lead performance.
    

## 16.6 Community moderation module

Capabilities:

- Review submitted posts.
    
- Compare against official rate data.
    
- Approve/reject/request edit.
    
- Hide published item.
    

## 16.7 Leads module

Capabilities:

- Kanban/list toggle.
    
- Assign banker.
    
- Update status.
    
- Add note.
    
- Schedule appointment.
    
- Export filtered leads.
    

## 16.8 Content module

Capabilities:

- CRUD articles.
    
- Manage glossary.
    
- Manage FAQ.
    
- Manage SEO fields.
    
- Preview page.
    

## 16.9 Audit module

Capabilities:

- List all audit events.
    
- Filter by actor, entity type, date.
    
- Inspect before/after JSON.
    

## 17. Banker app modules spec

## 17.1 Registration

- Email/password registration.
    
- Phone verification optional in first release.
    
- Upload initial identity docs.
    
- Select bank and branch.
    

## 17.2 Profile builder

- Avatar.
    
- Bio.
    
- Job title.
    
- Experience.
    
- Specialty tags.
    
- Province served.
    
- Contact settings.
    
- Public preview.
    

## 17.3 Lead inbox

- Assigned leads list.
    
- Filter by status.
    
- Lead detail.
    
- Timeline/events.
    
- Add notes.
    
- Update status.
    
- Schedule callback or meeting.
    

## 17.4 Performance

- Total assigned.
    
- Contacted rate.
    
- Qualified rate.
    
- Won rate.
    
- Average response time.
    

## 18. API contract guidelines

Mọi API phải:

- Versioned dưới `/api/v1`.
    
- Validate bằng Zod.
    
- Trả format chuẩn `{ data, meta, error }`.
    
- Support pagination với `page`, `pageSize`, `total`.
    
- Support filter params rõ ràng.
    
- Log audit cho mọi mutation admin.
    

## 18.1 Example endpoint groups

- `POST /api/v1/auth/register`
    
- `POST /api/v1/auth/login`
    
- `GET /api/v1/public/categories`
    
- `GET /api/v1/public/products`
    
- `GET /api/v1/public/products/:slug`
    
- `GET /api/v1/public/bankers`
    
- `POST /api/v1/public/leads`
    
- `POST /api/v1/public/calculators/:slug/run`
    
- `GET /api/v1/admin/banks`
    
- `POST /api/v1/admin/banks`
    
- `POST /api/v1/admin/rates/import`
    
- `POST /api/v1/admin/rates/:id/verify`
    
- `POST /api/v1/admin/bankers/:id/verify`
    
- `POST /api/v1/admin/leads/:id/assign`
    
- `GET /api/v1/banker/leads`
    
- `POST /api/v1/banker/leads/:id/status`
    

## 19. Ranking and filtering rules

## 19.1 Compare ranking v1

Ranking score là tổ hợp có trọng số của:

- Rate attractiveness.
    
- Fee burden.
    
- Eligibility friendliness.
    
- Data freshness.
    
- Featured boost manual.
    

Không dùng ML ở V1; chỉ dùng deterministic rules engine.

## 19.2 Banker ranking v1

Xếp hạng banker dựa trên:

- Verification status.
    
- Is accepting leads.
    
- Coverage match theo tỉnh.
    
- Specialty match theo category.
    
- Average rating.
    
- Recent activity.
    

## 20. Calculators spec

Danh sách calculators v1:

- Deposit interest calculator.
    
- Max loan amount calculator.[nganhang](https://nganhang.com/cong-cu-tinh/tinh-khoan-vay-toi-da)
    
- Flat interest loan calculator.[nganhang](https://nganhang.com/cong-cu-tinh/tinh-lai-vay-du-no-ban-dau)
    
- Social housing eligibility checker.[nganhang](https://nganhang.com/cong-cu-tinh/kiem-tra-dieu-kien-nha-o-xa-hoi)
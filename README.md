## CAST DB Created At / Updated at Column from Varchar to Timestampz

ALTER TABLE TABLE_NAME ADD COLUMN created_at_temp TIMESTAMP with time zone NULL;
UPDATE TABLE_NAME SET created_at_temp = created_at::TIMESTAMP with time zone;
ALTER TABLE TABLE_NAME ALTER COLUMN created_at TYPE TIMESTAMP with time zone USING created_at_temp;
ALTER TABLE TABLE_NAME DROP COLUMN created_at_temp;

## CAST DB Created At / Updated at Column from Timestampz to New Column Timestampz

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/globalbees_tech/muse.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/globalbees_tech/muse/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing(SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thank you to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.



ALTER TABLE public.product_listing_details ADD a_plus_updated_at timestamptz NULL;
ALTER TABLE public.product_listing_details ADD aplus text NULL;


ALTER TABLE public.bsr_listings ALTER COLUMN category_node_id TYPE varchar USING category_node_id::varchar;
ALTER TABLE public.bsr_listings ALTER COLUMN node_id TYPE varchar USING node_id::varchar;


ALTER TABLE public.category_search_keywords ALTER COLUMN category_node_id TYPE varchar USING category_node_id::varchar;
ALTER TABLE public.category_search_keywords ALTER COLUMN node_id TYPE varchar USING node_id::varchar;

ALTER TABLE product_medias ADD COLUMN created_at TIMESTAMP with time zone;
UPDATE product_medias SET created_at = "createdAt";
ALTER TABLE product_medias DROP COLUMN "createdAt";

ALTER TABLE public.category_search_keywords ALTER COLUMN sfr TYPE int4 USING sfr::int4;

ALTER TABLE public.category_search_keywords ALTER COLUMN click_share1 TYPE float4 USING click_share1::float4;
ALTER TABLE public.category_search_keywords ALTER COLUMN conversion_share1 TYPE float4 USING conversion_share1::float4;
ALTER TABLE public.category_search_keywords ALTER COLUMN conversion_share2 TYPE float4 USING conversion_share2::float4;
ALTER TABLE public.category_search_keywords ALTER COLUMN click_share2 TYPE float4 USING click_share2::float4;
ALTER TABLE public.category_search_keywords ALTER COLUMN conversion_share3 TYPE float4 USING conversion_share3::float4;
ALTER TABLE public.category_search_keywords ALTER COLUMN click_share3 TYPE float4 USING click_share3::float4;
ALTER TABLE public.category_search_keywords ALTER COLUMN top_brands TYPE varchar USING top_brands::varchar;
ALTER TABLE public.category_search_keywords ALTER COLUMN top_categories TYPE varchar USING top_categories::varchar;

## DEC 13

ALTER TABLE public.products DROP COLUMN in_transit;
ALTER TABLE public.products DROP COLUMN incoming_inventory;
ALTER TABLE public.products DROP COLUMN has_inventory;
ALTER TABLE public.products ADD incoming_inventory float8 NULL;

## DEC14

ALTER TABLE public.product_listing_qcs ADD CONSTRAINT sku_marketplace_ch_prod_id UNIQUE (gb_sku, marketplace, channel_product_id);

CREATE INDEX index_gb_sku
ON product_listing_qcs (gb_sku);

ALTER TABLE public.product_listing_qcs ADD brand varchar NULL;


ALTER TABLE public.products ADD mrp double precision NULL;

# dec27

ALTER TABLE public.products ADD usecase_jsonb jsonb NULL

UPDATE products
SET usecase_jsonb = (SELECT jsonb_build_array(usecase) FROM products p2 WHERE p2.id = products.id)
where products.usecase is not null

ALTER TABLE public.products DROP COLUMN usecase;

ALTER TABLE public.products RENAME COLUMN usecase_jsonb TO usecase;


ALTER TABLE public.products ADD key_features_jsonb jsonb NULL;

UPDATE products
SET key_features_jsonb = (SELECT jsonb_build_array(key_features) FROM products p2 WHERE p2.id = products.id)
where products.key_features is not null

ALTER TABLE public.products DROP COLUMN key_features;

ALTER TABLE public.products RENAME COLUMN key_features_jsonb TO key_features;

ALTER TABLE public.products ADD comparision_text jsonb NULL;

# Dec 28

ALTER TABLE
  "public"."product_listing_qcs"
ALTER COLUMN
  "images_feedback"
TYPE
  TEXT,
ALTER COLUMN
  "bullets_feedback"
TYPE
  TEXT,
ALTER COLUMN
  "title_feedback"
TYPE
  TEXT,
ALTER COLUMN
  "aplus_feedback"
TYPE
  TEXT,
ALTER COLUMN
  "video_feedback"
TYPE
  TEXT;

  # jan 5


CREATE TYPE workflow_status_enum AS ENUM ('basic_content', 'basic_content_uc', 'listing_images', 'listing_text', 'listing_approved');


ALTER TABLE products
ADD COLUMN workflow_status workflow_status_enum;



ALTER TABLE products
ADD COLUMN assigned_to VARCHAR(255);

ALTER TABLE public.product_listing_qcs ADD title varchar NULL;
ALTER TABLE public.product_medias ADD dimensions varchar NULL;


# JAN12

CREATE TABLE active_crons (
    id SERIAL PRIMARY KEY,
    cron_name VARCHAR(255),
    cron_status BOOLEAN,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

# Jan 23

CREATE TABLE IF NOT EXISTS prompts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    prompt TEXT,
    mandatory_keys JSONB,
    character_limit_prompt VARCHAR(255),
    unacceptable_characters VARCHAR(255),
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

# Jan 24

ALTER TABLE public.product_listing_qcs ADD doc int4 NULL;
ALTER TABLE public.product_listing_qcs ADD drr int4 NULL;

# JAN 29

ALTER TABLE public.prompts ADD character_limit int4 NULL;

# Feb15

ALTER TABLE public.products ADD marketplace_title_100 text NULL;
ALTER TABLE public.products ADD marketplace_title_120 text NULL;

# feb20

ALTER TABLE public.products ADD amazon_product_type varchar NULL;


# mar13

ALTER TABLE public.products ADD meta_tags text NULL;

# apr 17 

create table if not exists "flipkart_category_search_keywords" (
id serial4 NOT NULL ,
"query" VARCHAR(255),
"volume" int4,
"impressions" int4,
"ppv" int4,
"add_to_cart_clicks" int4,
"buy_now_clicks" int4,
"ctr" FLOAT,
"volume_change" FLOAT,
"top_fsn_sales_percent" FLOAT,
"created_at" TIMESTAMP with TIME zone  null,
"updated_at" TIMESTAMP with TIME zone  null,
CONSTRAINT flipkart_category_search_keywords_pkey PRIMARY KEY (id));

CREATE TABLE public.flipkart_category_search_keywords_products (
	id serial4 NOT NULL,
	product_id varchar(255) NULL,
	brand varchar(255) NULL,
	cms_vertical varchar(255) NULL,
	impressions int4 NULL,
	ppv int4 NULL,
	ctr float8 NULL,
	add_to_cart_clicks int4 NULL,
	buy_now_clicks int4 NULL,
	itemid varchar(255) NULL,
	sales_share float8 NULL,
	clicks_share float8 NULL,
	"__typename" varchar(255) NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	query varchar NULL,
	CONSTRAINT flipkart_category_search_keywords_products_pkey PRIMARY KEY (id)
);


create table if not exists flipkart_product_listing_details (
    id serial4 not null,
    channel_product_id VARCHAR,
    gb_sku VARCHAR,
    channel_sku VARCHAR,
    channel VARCHAR,
    entity VARCHAR,
    issues JSONB,
    variants JSONB,
    vertical VARCHAR,
    variant_group_id VARCHAR,
    fk_last_modified_on VARCHAR,
    fk_created_on VARCHAR,
    catalog_attributes JSONB,
    images JSONB,
    keywords JSONB,
    model_name VARCHAR,
    color VARCHAR,
    description text,
    other_features VARCHAR,
    created_by VARCHAR,
    updated_by VARCHAR,
	  created_at timestamptz not null,
	  updated_at timestamptz not null,
    constraint flipkart_product_listing_details_pkey primary key (id)
);

# may 8

CREATE TABLE IF NOT EXISTS product_listing_contents (
    id serial4 not null,
    product_id int4 NULL,
    content_type VARCHAR,
    marketplace VARCHAR,
    data JSONB,
    provisional_data JSONB,
    approved_by VARCHAR,
    approved_at timestamptz not null,
    created_at timestamptz not null,
	  updated_at timestamptz not null,
    CONSTRAINT product_listing_contents_pkey PRIMARY KEY (id),
    CONSTRAINT product_listing_contents_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL ON UPDATE CASCADE
);


ALTER TABLE public.product_listing_contents ADD CONSTRAINT prod_id_marketplace_content_type UNIQUE (product_id,content_type, marketplace);


# may 10

CREATE TABLE IF NOT EXISTS product_listing_feedbacks (
  id serial4 not null,
  product_listing_content_id int4 NULL,
  feedback TEXT,
  responses JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'new',
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_at timestamptz not null,
	updated_at timestamptz not null,
  CONSTRAINT product_listing_feedbacks_pkey PRIMARY KEY (id),
  CONSTRAINT product_listing_feedbacks_fkey FOREIGN KEY (product_listing_content_id) REFERENCES public.product_listing_contents(id) ON DELETE SET NULL ON UPDATE CASCADE
);



# may 30

ALTER TABLE products ADD COLUMN d2c_price FLOAT;
ALTER TABLE products ADD COLUMN is_live BOOLEAN DEFAULT FALSE;


# june 4
CREATE TYPE revised_content_status_type as ENUM('pending', 'rejected', 'approved');
CREATE TYPE content_status_type as ENUM('pending', 'rejected', 'approved', 'published');

ALTER TABLE product_listing_contents
  ADD COLUMN revised_content JSONB NULL,
  ADD COLUMN notes JSONB NULL,
  ADD COLUMN revised_content_status revised_content_status_type NULL,
  ADD COLUMN content_status content_status_type NULL;


# 10 JUNE 2023 (6672- Flipkart data fetch Enhancements and Fixes)
CREATE TABLE flipkart_verticals (
    id SERIAL PRIMARY KEY,
    cms_vertical VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_fetched_at TIMESTAMP 
);


INSERT INTO flipkart_verticals (cms_vertical)
SELECT DISTINCT(category_node)
FROM mp_live_products
WHERE category_node IS NOT NULL
GROUP BY category_node;

ALTER TABLE public.flipkart_category_search_keywords ADD cms_vertical_id int4 NULL;

-------------------------------------------------------------------
# 20 june
ALTER TABLE prompts
  ADD COLUMN model_name VARCHAR NULL,
  ADD COLUMN model_provider VARCHAR NULL;

# 21 june
ALTER TABLE public.products ADD published_at timestamptz NULL;
ALTER TABLE public.products ADD generative_content_available boolean DEFAULT false NULL;


# 24 Jun
// G.Muse 6776
ALTER TABLE public.product_listing_details ADD status varchar NULL;


ALTER TABLE public.products ADD category_name varchar NULL;

ALTER TABLE public.prompts ADD marketplace varchar NULL;


# 2 Aug

CREATE TYPE status_enum AS ENUM ('pending', 'resolved');

CREATE TABLE product_reviews_summarized (
  id SERIAL PRIMARY KEY,
  gb_sku VARCHAR(255),
  brand VARCHAR(255),
  gl_node VARCHAR(255),
  gl_fee_category VARCHAR(255),
  leaf_node VARCHAR(255),
  number_of_reviews INTEGER,
  summarized_review_count INTEGER,
  oldest_review_date TIMESTAMPTZ,
  latest_review_date TIMESTAMPTZ,
  review_summary_json JSONB,
  channel_product_id VARCHAR(255),
  marketplace VARCHAR(255),
  summarisation_date TIMESTAMP,
  action VARCHAR(255),
  remarks VARCHAR(255),
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  updated_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  status status_enum
);

ALTER TABLE product_reviews_summarized
	ADD COLUMN has_inventory BOOLEAN,
  ADD COLUMN inventory_valuation numeric,
  ADD COLUMN last_prompt_text text;

# 22 Aug

ALTER TABLE prompts
ADD COLUMN allow_branded_content BOOLEAN DEFAULT true NOT NULL;

ALTER TABLE public.prompts ADD save_in_product_listing_content boolean NULL DEFAULT false;
ALTER TABLE public.prompts ADD overwrite_existing_content boolean NULL DEFAULT false;


# 11 Sep

ALTER TABLE public.flipkart_category_search_keywords_products ADD prod_title varchar NULL;
ALTER TABLE public.flipkart_category_search_keywords_products ADD image_url varchar NULL;
ALTER TABLE public.flipkart_category_search_keywords_products ADD avg_price float8 NULL;

# 20 Sep


CREATE TABLE
  public.search_keyword_competitor_product_ranking (
    search_keyword character varying NULL,
    rank bigint NULL,
    channel_product_id character varying(255) NULL,
    avg_selling_price double precision NULL,
    title character varying NULL,
    marketplace text NULL,
    image_url text NULL,
    vertical text NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
  );


INSERT INTO search_keyword_competitor_product_ranking
SELECT
  query AS search_keyword,
  rank AS rank,
  product_id AS channel_product_id,
  avg_price AS avg_selling_price,
  prod_title AS title,
  'flipkart' AS marketplace, 
  image_url AS image_url,
  cms_vertical as vertical,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM (
  SELECT 
    query, 
    product_id, 
    avg_price, 
    prod_title, 
    image_url,
    cms_vertical,
    ROW_NUMBER() OVER (PARTITION BY query ORDER BY sales_share DESC) AS rank 
  FROM flipkart_category_search_keywords_products
) base
WHERE rank < 4 
  AND avg_price IS NOT NULL 
  AND product_id IS NOT NULL;

ALTER TABLE products
ADD COLUMN competition_fsns JSONB;

ALTER TABLE public.products ADD returnable_duration int4 NULL;









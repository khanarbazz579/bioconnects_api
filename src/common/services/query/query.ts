export class Query {
  static dbHealthCheck() {
    return `select * from orders where id=0`;
  }

  static getProductsFromMolly(gbSkus?: string[]) {
    if (gbSkus && gbSkus.length > 0) {
      return `
        select
          p.id as "productId",
          p.sku as "gbSku",
          p.ean,
          p.title,
          p.images as "productImages",
          p.brand,
          b.id as "brandId",
          p.categories::json->>0 as categories,
          p.product_type as "productType",
          CASE
            WHEN p.is_active IS true then 'active'
            else 'inactive'end
          as "status"
        from
          products p
          left join brands b on b.name = p.brand
        where
          p.ean is not null
          and lower(p.product_type) in ('finished goods', 'assembled goods', 'multi listing product', 'virtual bundle')
          and p.sku not in (${gbSkus.join(',')})
          and p.is_active = true
          and p.sync_status in ('sent', 'priority', 'synced')
        limit
          1000
      `;
    }
    return `
      select
        p.id as "productId",
        p.sku as "gbSku",
        p.ean,
        p.title,
        p.images as "productImages",
        p.brand,
        b.id as "brandId",
        p.categories::json->>0 as categories,
        p.product_type as "productType",
        CASE
          WHEN p.is_active IS true then 'active'
          else 'inactive'end
        as "status"
      from
        products p
        left join brands b on b.name = p.brand
      where
        p.ean is not null
        and lower(p.product_type) in ('finished goods', 'assembled goods', 'multi listing product', 'virtual bundle')
        and p.is_active = true
        and p.sync_status in ('sent', 'priority', 'synced')
      limit
        1000  
    `;
  }

  static getBrowseNode() {
    return `
    SELECT DISTINCT browse_node AS browse_node
FROM product_listing_details
WHERE browse_node IS NOT NULL

UNION

SELECT DISTINCT node_id AS browse_node
FROM category_nodes
WHERE data_requested = true
AND bsr_fetched_at < NOW() - INTERVAL '24h'

UNION

SELECT DISTINCT node_id AS browse_node
FROM products

EXCEPT

SELECT DISTINCT node_id AS browse_node
FROM category_search_keywords
WHERE updated_at >= NOW() - INTERVAL '7d'

except

select
    c1.node_id
from
    (
    select
        node_id,
        MAX(updated_at) as updatedat
    from
        public.bsr_listings bl
    where
        (bl.asin = ''
            or bl.asin is null)
    group by
        node_id
    having
        COUNT(*) > 10) c1
where
    DATE(c1.updatedat) != CURRENT_DATE`;
  }

  static getSearchTermData() {
    return `select
    distinct (bl.asin),
    bl.node_id
  from
    bsr_listings bl 
  where
    node_id  not in (
    select
      distinct(node_id)
    from
      category_search_keywords csk
    where
      updated_at >= NOW() - INTERVAL '7d')
      and node_id is not null
      and asin is not null`;
  }

  static updateInventory() {
    return `
    UPDATE public.products AS p
    SET
        inventory_valuation = s.inventory_valuation,
        in_transit_inventory = s.in_transit_quantity,
        total_inventory = s.total_inventory,
        incoming_inventory = s.incoming_inventory,
        doc = s.days_of_cover ,
        drr = s.drr
    FROM
        public.skus_with_inventory AS s
    WHERE
        p.gb_sku = s.gb_sku;    
    `;
  }

  static getItemsForProductListingQc(createdAt: string) {
    return `
      select
        p.sku as "gbSku",
        pwcm.channel_product_id as "channelProductId",
        wc.marketplace_name as "marketplace"
      from
        product_wh_channel_maps pwcm
        left join warehouse_channels wc on wc.id = pwcm.wh_channel_id
        left join products p on p.id = pwcm.product_id
      where
        lower(wc.type) = 'marketplace'
        and lower(marketplace_name) <> 'shopify'
        and lower(marketplace_name) <> 'gbiz'
        and channel_product_id is not null
        and pwcm."createdAt" >= '${createdAt}'
      group by
        p.sku,
        pwcm.channel_product_id,
        wc.marketplace_name
    `;
  }

  static getMissingImagesInPmedia() {
    return `
      SELECT
        pld.id AS product_listing_details_id,
        pld.images,
        pld.video_url,
        p.id as product_id,
        p.gb_sku as product_sku,
        p.brand_id as brand_id
      FROM
        public.product_listing_details pld
        LEFT JOIN public.products p ON pld.gb_sku = p.gb_sku
        LEFT JOIN public.product_medias pm ON p.id = pm.product_id
      WHERE
        pld.gb_sku IS NOT null
        AND p.id IS NOT NULL
        AND pm.id IS NULL
        AND pld.images IS NOT NULL
        limit 500;`;
  }

  static getMissingImagesInPmediaV2(gbSku: string) {
    return `
 SELECT
        pld.id AS product_listing_details_id,
        pld.images,
        pld.video_url,
        p.id as product_id,
        p.gb_sku as product_sku,
        p.brand_id as brand_id,
        pld.updated_at
      FROM
        public.product_listing_details pld
        LEFT JOIN public.products p ON pld.gb_sku = p.gb_sku
      WHERE
        pld.gb_sku = '${gbSku}'
        AND p.id IS NOT NULL
        AND pld.images IS NOT null
      order by pld.updated_at desc;`;
  }

  static getMissingPldWithInventory() {
    return `SELECT
    qcs.gb_sku,
    qcs.channel_product_id
  FROM
    public.product_listing_qcs qcs
    LEFT JOIN public.product_listing_details pld ON qcs.gb_sku = pld.gb_sku
  WHERE
    pld.gb_sku IS NULL
    and qcs.marketplace = 'Amazon India'
    and qcs.gb_sku is not null
    and qcs.channel_product_id is not null
  order by
  total_inventory desc;`;
  }

  static getMissingFpld() {
    return ` select
    mlp.global_sku as "gbSku",
    mlp.channel_sku as "channelSku",
    mlp.entity,
    mlp.channel_product_id as "channelProductId",
    mlp.channel 	
  from
    public.mp_live_products mlp 
  left join public.flipkart_product_listing_details fpld on
    fpld.gb_sku = mlp.global_sku
    and fpld.entity = mlp.entity
    and fpld.channel_product_id = mlp.channel_product_id
  where
    (fpld.gb_sku is null or fpld.updated_at < NOW() - INTERVAL '7d' )
    and mlp.marketplace = 'flipkart'
    and mlp.entity ='me02'
    and mlp.global_sku is not null
    and mlp.channel_product_id is not null
  limit 2000;`;
  }

  static getMissingPldMapping(gbSku, asin) {
    return `select
    products.sku as gb_sku,
    product_wh_channel_maps.channel_product_id,
    product_wh_channel_maps.channel_sku,
    products.ean,
    warehouse_channels.code as channel,
    legal_entities.company_code as entity,
    lower(warehouse_channels.type::text) as channel_type,
    warehouse_channels.marketplace_name
  from
    product_wh_channel_maps
    join warehouse_channels on warehouse_channels.id = product_wh_channel_maps.wh_channel_id
    join legal_entities on legal_entities.id = warehouse_channels.legal_entity_id
    join products on products.id = product_wh_channel_maps.product_id
  where
    products.sku = '${gbSku}'
    and product_wh_channel_maps.channel_product_id = '${asin}'
    and legal_entities.company_code != 'gb01'
    and warehouse_channels.status = 'active'
    and warehouse_channels.marketplace_name in ('Amazon India','Amazon Katastimaa One')
  order by
    product_wh_channel_maps."createdAt" desc
  limit
    1;`;
  }

  static refreshMissingPldMapping(gbSku) {
    return `select
    products.sku as gb_sku,
    product_wh_channel_maps.channel_product_id,
    product_wh_channel_maps.channel_sku,
    products.ean,
    warehouse_channels.code as channel,
    legal_entities.company_code as entity,
    lower(warehouse_channels.type::text) as channel_type,
    warehouse_channels.marketplace_name
  from
    product_wh_channel_maps
    join warehouse_channels on warehouse_channels.id = product_wh_channel_maps.wh_channel_id
    join legal_entities on legal_entities.id = warehouse_channels.legal_entity_id
    join products on products.id = product_wh_channel_maps.product_id
  where
    products.sku = '${gbSku}'
    and legal_entities.company_code != 'gb01'
    and warehouse_channels.status = 'active'
    and warehouse_channels.marketplace_name in ('Amazon India','Amazon Katastimaa One')
  order by
    product_wh_channel_maps."createdAt" desc`;
  }

  static getAmazonImages() {
    return `
      select id,url from product_medias where url ilike '%m.media-amazon%' limit 1000;
    `;
  }

  static getImagesForCloudinary(brandIds: number[], limit: number) {
    return `
      select
        pm.id,
        pm.url
      from
        product_medias pm
        left join products p on p.id = pm.product_id
      where
        (pm.url ilike '%s3.ap-south-1.amazonaws.com%'
        or  pm.url ilike '%m.media-amazon%')
        and type ='image'
        and p.brand_id in (${brandIds.join(',')})
        and pm.public_id is null
      limit ${limit};
    `;
  }

  static getImagesForCloudinaryToS3(limit: number) {
    return `
      select
        pm.id,
        pm.url,
        p.gb_sku
      from
        product_medias pm
        left join products p on p.id = pm.product_id
      where
        pm.url ilike '%res.cloudinary%'
        and pm.public_id is not null
        and type ='image'
        and cdn_url is null
      limit ${limit};
    `;
  }

  static cloudinaryTransform(brand, limit, skuFilter) {
    return `select
    pm.id,
    pm.url,
    pm.public_id,
    p.gb_sku,
    pm.original_url
  from
    product_medias pm
    left join products p on p.id = pm.product_id
  where
   type  = 'image'
    and p.brand_id in (${brand.join(',')})
    and pm.cdn_url is null
    ${skuFilter}
    AND (p.total_inventory + p.in_transit_inventory + p.incoming_inventory) > 0
    order by p.gb_sku asc
  limit ${limit};`;
  }

  static updateSfrStatus() {
    return `UPDATE category_nodes cn
    SET sfr = true    
    FROM category_search_keywords csk    
    WHERE csk.node_id = cn.node_id AND csk.node_id IS NOT NULL;
            
    
    UPDATE category_nodes cn    
    SET category_node_insight = true    
    FROM category_node_insights cni    
    WHERE cni.category = cn.search_text AND cni.category IS NOT NULL; `;
  }

  static moveCdnToS3() {
    return `
  select
    pm.id,
    pm.url,
    p.gb_sku
  from
    product_medias as pm
    left join products p on p.id = pm.product_id
  where
    url ilike '%res.cloudinary%'
    and public_id is not null
    and original_url is not null
    and cdn_url is not null
    and p.gb_sku is not null;`;
  }

  static getAmazonMapping(gbSku: string) {
    return `
    select
  pwcm.channel_sku,
  pwcm.channel_product_id,
  wc.code as channel_code,
  wc.meta,
  le.company_code as entity
from
  product_wh_channel_maps as pwcm
  left join warehouse_channels as wc on pwcm.wh_channel_id = wc.id
  left join legal_entities as le on pwcm.legal_entity_id = le.id
  left join products as p on p.id = pwcm.product_id 
where
  wc.marketplace_name ilike '%amazon%'
  and wc.status = 'active'
  and le.status = 'active'
  and pwcm.status = 'active'
  and p.sku = '${gbSku}'
  and wc.code not in ('amazon_mws', 'amazon_sc_es', 'amazon_sc_plantex', 'amazon_sc_solarista', 'amazon_sc_cloudlifestyle', 'amazon_sc_candes');`;
  }

  static getProductMediaOrder() {
    return `SELECT
    ROW_NUMBER() OVER (ORDER BY id ASC) AS row_number,
    document_code
FROM
    static_fields sf
WHERE
    "type" = 'product_media'
    AND status = 'active'
ORDER BY
    id ASC;`;
  }

  static myntraImage(brand, limit) {
    return `select
    mm.id,
    mm.original_url,
    mm.cdn_url,
    mm.url,
    mm.ocr_text,
    p.gb_sku
  from
    media_master as mm
    left join product_medias as pm on mm.product_medias_id = pm.id
    left join products as p on pm.product_id = p.id
  where
    pm.public_id is not null
    and mm.ocr_text is not null
    and p.brand_id in (${brand.join(',')})
    and myntra_url is null
    limit ${limit};`;
  }

  static myntraImageV2(brand, limit) {
    return `select
    mm.id,
    mm.original_url,
    mm.cdn_url,
    mm.url,
    mm.ocr_text,
    p.gb_sku,
    pm.public_id
  from
    media_master as mm
    left join product_medias as pm on mm.product_medias_id = pm.id
    left join products as p on pm.product_id = p.id
  where
    mm.ocr_text is not null
    and p.brand_id in (${brand.join(',')})
    and myntra_url is null
    order by p.gb_sku
    limit ${limit};`;
  }

  static myntraImageFailover(brand, limit) {
    return `select
    mm.id,
    mm.original_url,
    mm.cdn_url,
    mm.url,
    mm.ocr_text,
    p.gb_sku,
    pm.public_id
  from
    media_master as mm
    left join product_medias as pm on mm.product_medias_id = pm.id
    left join products as p on pm.product_id = p.id
  where
    mm.ocr_text is not null
    and p.brand_id in (${brand.join(',')})
    and myntra_url = ''
    and mm.cdn_url is not null
    limit ${limit};`;
  }

  static updateMyntraUrl(mmId, myntraUrl) {
    return `
    update media_master
    set myntra_url = '${myntraUrl}'
    where id = ${mmId}`;
  }

  static updateMyntraUrlV2(mmId, myntraUrl, cdnUrl, publicId) {
    return `
    update media_master
    set myntra_url = '${myntraUrl}',
    cdn_url = '${cdnUrl}',
    public_id = '${publicId}',
    updated_at = now()
    where id = ${mmId};
    
    update product_medias
    set cdn_url = '${cdnUrl}',
    public_id = '${publicId}'
    where media_master_id = ${mmId};
    `;
  }

  static getAttribute(nodeId: string) {
    return `select
    attribute_raw_name as "attributeRawName",
    attribute_usage as "attributeUsage",
    attribute_short_description as "attributeShortDescription",
    attribute_datatype as "attributeDatatype",
    attribute_enumeration_values as "attributeEnumerationValues",
    menu_display_label as "menuDisplayLabel",
    attribute_display_label as "attributeDisplayLabel",
    '' as value
  from
    product_type_attribute_masters as ptam
    join category_nodes as cn on ptam.product_type = cn.product_type
  where
    cn.node_id = '${nodeId}'
    and attribute_classification != 'IMAGE'
    and use_for_listing =true
    group by 
    attribute_raw_name ,
    attribute_usage ,
    attribute_short_description ,
    attribute_datatype ,
    attribute_enumeration_values ,
    menu_display_label ,
    attribute_display_label;`;
  }

  static attributeAmazonFile(productType: string) {
    return `select
    attribute_raw_name  as "attributeRawName",
    attribute_display_label as "attributeDisplayLabel"
  from
    product_type_attribute_masters ptam
  where
    product_type ='${productType}' 
    and attribute_display_label is not null
    and attribute_display_label != '';`;
  }

  static museProductsWithoutMapping() {
    return `SELECT
    amazon_product_type as "amazonProductType",
    ARRAY_AGG(gb_sku) AS "gbSku"
  FROM
    muse_products_without_mapping
  GROUP BY
    amazon_product_type;`;
  }

  static productImageAmazonFile(gbSku) {
    return `
    select
    p.gb_sku as "gbSku",
    mm.url,
    pm.listing_type as "listingType"
      from
        media_master as mm
        left join product_medias as pm on mm.id = pm.media_master_id
        left join products as p on pm.product_id = p.id
      where
        p.gb_sku in (${gbSku.map(item => `'${item}'`).join(',')})
        and pm.type='image';`;
  }

  static getImageFcUrl(skuArray: string) {
    return `select
    pm.id as "pmId",
    mm.url as url,
    pm.listing_type as "listingType",
    p.gb_sku as "gbSku"
  from
    media_master mm
  join product_medias pm on
    pm.media_master_id = mm.id
  join products p on
    p.id = pm.product_id
    where p.gb_sku in (${skuArray})
    and pm.type='image'
    and pm.fc_url is null;`;
  }

  static getAzProductsMolly(skus) {
    return `
    select
	p.sku as "gbSku",
	p.product_height,
	p.product_length,
	p.product_weight,
	p.product_width,
  p.package_length,
  p.package_width,
  p.package_height,
  p.package_weight,
	p.tax,
	p.hsn,
	p.country_of_origin,
  'AMAZON_IN' as fulfillment_center_id
from
	products p
where
	p.ean is not null
	and p.sku in (${skus.map(item => `'${item}'`).join(',')})
	and p.is_active = true`;
  }

  static completeCniJob() {
    return `UPDATE public.category_node_insights_jobs
    SET status = 'completed'
    WHERE status = 'requested'
    AND EXISTS (
        SELECT 1
        FROM public.category_node_insights
        WHERE category = category_node_insights_jobs.report_name
        AND created_at::date >= current_date - interval '60 days'
    );
    `;
  }

  static getGlNodeData() {
    return `select
    distinct(category_node),
    count(ean)
  from
    mp_live_products mlp
  where
    category_node is not null
  group by
    category_node
  order by
    count desc;`;
  }

  static truncateFlipkartSfr() {
    return `TRUNCATE TABLE flipkart_category_search_keywords;
    TRUNCATE TABLE flipkart_category_search_keywords_products;`;
  }

  static backFillCompetitionSfr() {
    return `select
    p.gb_sku
  from
    products p
  left join competition_search_keywords csk on
    csk.product_id = p.id
  where
    csk.product_id is null
    and p.competition_asins is not null
    limit 100;`;
  }

  static getAsinsFromSfr(sfrs) {
    return `with CombinedCTE as (
      select
        asin1,
        asin2,
        asin3,
        status,
        created_at
      from
        category_search_keywords
      where
        search_keyword in (${sfrs})
      union all
      select
        asin1,
        asin2,
        asin3,
        status,
        created_at
      from
        competition_search_keywords
      where
        search_keyword in (${sfrs})
      )select
        asin1,
        asin2,
        asin3
      from
        CombinedCTE;`;
  }

  static getCompetitorProductsFromSearchKeywords(searchKeywords: string[], marketplace: string, gbSku: string) {
    return `
      SELECT
        skc.title as title,
        skc.avg_selling_price as avg_selling_price,
        skc.channel_product_id as channel_product_id

      FROM search_keyword_competitor_product_ranking as skc

      where marketplace = '${marketplace}'
      and search_keyword in (${searchKeywords.map(item => `'${item.replace("'", "''")}'`).join(',')})
      ${marketplace === 'flipkart' ? `and skc.vertical = (SELECT vertical FROM flipkart_product_listing_details where gb_sku = '${gbSku}' ORDER BY updated_at DESC LIMIT 1)` : ''}
      ;
    ` 
  }

  static getComp(asinFilter){
    return `select
    channel_product_id as asin,
    product_price  as "productPrice",
    title as "productTitle"
  from
    competition_product_listing_details cpld
  where
    cpld.channel_product_id in (${asinFilter})`;
  }

  static missingCompetitionProductAsinsCount() {
    return `SELECT COUNT(*) FROM (
      SELECT distinct asin FROM missing_competition_asins_title_or_price
      where title is null or brand is null
    ) base
    `;
  }

  static missingCompetitionProductAsins(offset: number, BATCH_SIZE: number) {
    return `SELECT * FROM (
      SELECT distinct asin FROM missing_competition_asins_title_or_price
      where title is null or brand is null
    ) base
    LIMIT ${BATCH_SIZE}
    OFFSET ${offset} 
    `;
  }

  static missingCompetitionProductPriceAsinsCount() {
    return `
    SELECT count(*) FROM (
      SELECT distinct channel_product_id FROM competition_product_listing_details where product_price is null
    ) base
    `;
  }

  static missingCompetitionProductPriceAsins(
    offset: number,
    BATCH_SIZE: number,
  ) {
    return `
      SELECT channel_product_id as asin FROM (
        SELECT distinct channel_product_id FROM competition_product_listing_details where product_price is null
      ) base
      LIMIT ${BATCH_SIZE}
      OFFSET ${offset} 
    `;
  }

  static getRawAsinsAndCompAsinsFromBrandAnalytics(offset: number, BATCH_SIZE: number) {
    return `
      SELECT our_asin, comp_asins, p.title as our_title, p.gb_sku as our_gb_sku, p.mrp as our_mrp, p.key_features as our_key_features FROM (
        SELECT our_asin, STRING_AGG(comp_asin,',') as comp_asins 
        FROM asin_competition_tagging_calc    
        GROUP BY our_asin
      ) as our_asin

      LEFT JOIN product_listing_details as pld
      ON pld.channel_product_id = our_asin.our_asin

      LEFT JOIN products as p
      ON p.gb_sku = pld.gb_sku

      where p.competition_asins is null and p.gb_sku is not null and p.key_features is not null and jsonb_array_length(p.key_features) > 0
      LIMIT ${BATCH_SIZE}
      OFFSET ${offset}
      `
  }

  static getTopSfrKeywordsForGbSku(gbSku: string){
    return `
      SELECT * FROM product_keyword_ranks where gb_sku = '${gbSku}';
    `
  }

  static updateProductsGenerativeContentAvailableStatus() {
    return `
      With ids_to_update as (
        SELECT DISTINCT id FROM products as p

        LEFT JOIN product_keyword_ranks as pkr
        ON pkr.gb_sku = p.gb_sku

        where TO_DATE(pkr.report_end_date, 'YYYY-MM-DD') > (published_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '3 days'
      )

      UPDATE products as p
      SET generative_content_available = true
      FROM ids_to_update
      WHERE p.id = ids_to_update.id
    `
  }

  static getTopBrandFromCategoryAndCompetitionSearch(){
    return `
        select
          distinct (top_brands) as brand
        from
          category_search_keywords
        where
          created_at > DATE_TRUNC('month', CURRENT_DATE) - interval '1 month'
        union all
            select
          distinct (top_brands) as brand
        from
          competition_search_keywords
        where
          created_at > DATE_TRUNC('month', CURRENT_DATE) - interval '1 month'`
        }
  static getReviewsByAsin(asin: string, BATCH_SIZE: number, BATCH_COUNT: number) {
    return `
      SELECT review_text FROM product_reviews_master
      where asin = '${asin}' 
      ORDER BY review_created_timestamp
      LIMIT ${BATCH_SIZE} OFFSET ${BATCH_SIZE * BATCH_COUNT}
    `
  }

  static insertProductsIntoProductReviewsSummarizationTable() {
    return `
      INSERT INTO product_reviews_summarized (
        channel_product_id, 
        marketplace, 
        gb_sku, 
        brand, 
        gl_node, 
        gl_fee_category, 
        leaf_node,
        number_of_reviews,
        oldest_review_date,
        latest_review_date,
        status,
        has_inventory,
        inventory_valuation,
        created_at,
        updated_at
      )

      SELECT 

        rm.channel_product_id as channel_product_id, 'amazon' as marketplace, mlp.global_sku as gb_sku,
        mlp.brand as brand, mlp.gl_node as gl_node, mlp.fee_category as gl_fee_category, mlp.category_node as leaf_node,
        rm_grouped.number_of_reviews as number_of_reviews, rm_grouped.oldest_review_date::timestamptz as oldest_review_date, rm_grouped.latest_review_date::timestamptz as latest_review_date,
        'pending' as status, CASE when inventory.total_inventory > 0 then true else false END as has_inventory, inventory.inventory_valuation as inventory_valuation,
        CURRENT_TIMESTAMP AT TIME ZONE 'UTC' as created_at, 
        CURRENT_TIMESTAMP AT TIME ZONE 'UTC' as updated_at

      FROM (SELECT distinct asin as channel_product_id FROM product_reviews_master) as rm

      LEFT JOIN (SELECT *, ROW_NUMBER() OVER (PARTITION BY channel_product_id ORDER BY updated_at DESC ) as rn FROM product_listing_details) as pld
      ON pld.channel_product_id = rm.channel_product_id
      and pld.rn = 1

      LEFT JOIN (SELECT *, ROW_NUMBER() OVER (PARTITION BY global_sku ORDER BY _airbyte_extracted_at DESC ) as rn FROM mp_live_products) as mlp
      ON mlp.global_sku = pld.gb_sku
      and mlp.rn = 1

      LEFT JOIN (
              SELECT 
                asin, 
                COUNT(*) as number_of_reviews,
                max(review_created_timestamp) as latest_review_date, 
                min(review_created_timestamp) as oldest_review_date
              FROM product_reviews_master
              GROUP BY asin
            ) as rm_grouped
            ON rm_grouped.asin = rm.channel_product_id

      LEFT JOIN (SELECT distinct channel_product_id FROM product_reviews_summarized) as prs
      ON prs.channel_product_id = rm.channel_product_id

      LEFT JOIN (SELECT *, ROW_NUMBER() OVER (PARTITION BY gb_sku ORDER BY _airbyte_emitted_at) FROM skus_with_inventory) as inventory
      ON inventory.gb_sku = pld.gb_sku

      where pld.id is not null and mlp.global_sku is not null and prs.channel_product_id is null
    `
  }

  static getProductForRunningReviewsSummarization(minReviews: string, minReviewsFirstTime: string, reSummarizesDaysDiff: string) {
    return `
      SELECT distinct channel_product_id FROM product_reviews_summarized prs

      LEFT JOIN (
        SELECT count(distinct review_text) as reviews_count, asin FROM product_reviews_master GROUP BY asin
      ) as total_reviews_count
      ON prs.channel_product_id = total_reviews_count.asin

      where
      ((total_reviews_count.reviews_count) - COALESCE(prs.summarized_review_count, 0)) > ${minReviewsFirstTime}
      OR 
      ( status = 'resolved' AND 
      AGE(CURRENT_TIMESTAMP , COALESCE(prs.summarisation_date, '2000-04-30 09:22:40+00')) > INTERVAL '${reSummarizesDaysDiff} days'
      AND
      ((total_reviews_count.reviews_count) - COALESCE(prs.summarized_review_count, 0)) > ${minReviews}
      )
    `
  }

  static getStuckShulexReports(){
    return `
    SELECT report_name as "reportName", id
    FROM category_node_insights_jobs
    WHERE status = 'requested'
    AND requested_at - created_at > INTERVAL '5 days';
`
  }



  static hasProductMediaFilterQuery(value:string){
    if(value?.toString()?.trim()?.toLowerCase()==='true'){
      return `(SELECT product_id FROM product_medias
        WHERE type = 'video')`
    }else{
      return ` (select distinct  p.id
                    FROM products p
                    LEFT JOIN product_medias pm ON p.id = pm.product_id
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM product_medias pm2
                        WHERE pm2.product_id = p.id
                        AND pm2.type = 'video'
                ))`
    }
  }


  static deleteRecordFor(tableName:string,productType:string){
    return `delete from ${tableName} where product_type='${productType}'`;
  }

}
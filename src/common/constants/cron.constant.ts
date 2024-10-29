export const crons = {
  exportJob: 'exportJob',
  requestDataFromShulex: 'requestDataFromShulex',
  generateProductHash: 'generateProductHash',
  cdnToS3: 'cdnToS3',
  categoryNodeStatus: 'categoryNodeStatus',
  backfillProductMedia: 'backfillProductMedia',
  cloudinaryTransformation: 'cloudinaryTransformation',
  RefreshProductListingDetails: 'RefreshProductListingDetails',
  UpdateProductHasInventoryFlag: 'UpdateProductHasInventoryFlag',
  createPldWithInventory: 'createPldWithInventory',
  createFlipkartProductListing: 'createFlipkartProductListing',
  bsrCron: 'bsrCron',
  aPlusCron: 'aPlusCron',
  testMultiPod: 'testMultiPod',
  getDataFromFlipkart: 'getDataFromFlipkart',
  backFillCompetitionSfr: 'backFillCompetitionSfr',
  fetchAndUpdateCompProductListingDetailsRunner:
    'fetchAndUpdateCompProductListingDetailsRunner',
  fetchAndUpdateCompProductListingPriceRunner:
    'fetchAndUpdateCompProductListingPriceRunner',
  backfillComptAsinsForProductsRunner: 'backfillComptAsinsForProductsRunner',
  fetchCategoryNodeFromMpLiveRunner: 'fetchCategoryNodeFromMpLiveRunner',
  updateProductsGenerativeContentAvailableStatusRunner: 'updateProductsGenerativeContentAvailableStatusRunner',
  getBrandMasterRunner: 'getBrandMasterRunner',
  insertProductsIntoProductReviewsSummarizationTableCronRunner: 'insertProductsIntoProductReviewsSummarizationTableCronRunner',
  handleStuckReportsOnShulexCronRunner: 'handleStuckReportsOnShulexCronRunner',
  summarizeProductReviewsCronRunner: 'summarizeProductReviewsCronRunner'
};

export const cronTTL = {
  // should be in seconds
  [crons.exportJob]: 30000,
  [crons.requestDataFromShulex]: 60000,
  [crons.generateProductHash]: 60000,
  [crons.cdnToS3]: 60000,
  [crons.categoryNodeStatus]: 60000,
  [crons.backfillProductMedia]: 60000,
  [crons.cloudinaryTransformation]: 30000,
  [crons.RefreshProductListingDetails]: 60000,
  [crons.UpdateProductHasInventoryFlag]: 60000,
  [crons.createPldWithInventory]: 60000,
  [crons.bsrCron]: 60000,
  [crons.aPlusCron]: 60000,
  [crons.testMultiPod]: 60000,
};

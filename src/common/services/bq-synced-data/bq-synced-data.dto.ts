export class TopSFRDataDto {
  readonly gbSku: string;
  readonly keywords: TopSFRDataKeywordsDto[];
}

export class TopSFRDataKeywordsDto {
  readonly score: string;
  readonly keyword: string;
}

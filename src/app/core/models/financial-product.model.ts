import { ApiResponseItem } from '../../shared/api-response-types';

interface IFinancialProduct {
  id: string;
  name: string;
  description: string;
  releaseDate: Date;
  revisionDate: Date;
  logoUrl: string;
}

export class FinancialProduct implements IFinancialProduct {
  id: string;
  name: string;
  description: string;
  releaseDate: Date;
  revisionDate: Date;
  logoUrl: string;

  constructor(
    id: string,
    name: string,
    description: string,
    releaseDate: Date,
    revisionDate: Date,
    logoUrl: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.releaseDate = releaseDate;
    this.revisionDate = revisionDate;
    this.logoUrl = logoUrl;
  }

  static fromApiResponse(data: ApiResponseItem[]): FinancialProduct[] {
    return data.map((item) => {
      return FinancialProduct.fromData(item);
    });
  }

  static fromData(data: ApiResponseItem): FinancialProduct {
    return new FinancialProduct(
      data.id,
      data.name,
      data.description,
      new Date(data.date_release),
      new Date(data.date_revision),
      data.logo
    );
  }

  static toDict(producto: FinancialProduct): Record<string, any> {
    return {
      id: producto.id,
      name: producto.name,
      description: producto.description,
      date_release: producto.releaseDate.toISOString(),
      date_revision: producto.revisionDate.toISOString(),
      logo: producto.logoUrl,
    };
  }
}

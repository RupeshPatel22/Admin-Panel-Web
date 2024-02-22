import { Services } from "src/app/shared/models";

export const gstCategoryList: { [key in Services]?: any } = {
    [Services.Food]: [{ id: 'restaurant', name: 'Restaurant' },
    { id: 'non-restaurant', name: 'Non-Restaurant' },
    { id: 'hybrid', name: 'Hybrid' }],
    [Services.Grocery]: [{ id: 'store', name: 'Store' },
    { id: 'non-store', name: 'Non-Store' },{ id: 'hybrid', name: 'Hybrid' }],
    [Services.Paan]: [{ id: 'store', name: 'Store' },
    { id: 'non-store', name: 'Non-Store' },{ id: 'hybrid', name: 'Hybrid' }],
    [Services.Flower]: [{ id: 'store', name: 'Store' },
    { id: 'non-store', name: 'Non-Store' },{ id: 'hybrid', name: 'Hybrid' }],
    [Services.Pharmacy]: [{ id: 'store', name: 'Store' },
    { id: 'non-store', name: 'Non-Store' },{ id: 'hybrid', name: 'Hybrid' }],
    [Services.Pet]: [{ id: 'store', name: 'Store' },
  { id: 'non-store', name: 'Non-Store'}, { id: 'hybrid', name: 'Hybrid' }]
  }
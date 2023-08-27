type Product = {
    idproduct: number,
    name: string,
    price: string,
    category: Category,
    stock: number,
    desc: string,
    img: string
    hide?: 0 | 1;
}

type Category = "" | "other" | "beans" | "capsules" | "machines" | "accessories";

type ProductFilters = {
    name?: string,
    category?: Category,
    min?: number,
    max?: number,
    sort?: 'asc' | 'desc' | '',
    hide?: 0 | 1,
    page?: number,
    amount?: number
}

type EditableUserField = 'iduser' | 'email' | 'pw' | 'phone' | 'fn' | 'ln' | 'city' | 'address';

type EditableProductField = keyof Product;

type Status = { success: boolean, msg: string };

export type { 
    Product,
    Category,
    ProductFilters,
    EditableUserField,
    EditableProductField,
    Status
}
type SurchargeType = {
  amount_type: string;
  amount_value: number;
  id: number;
  name: string;

  order_type: { [key: string]: boolean };
  order_type_aggregators: { [key: string]: boolean };
};
type TaxsType = {
  is_applied_in_open_item: boolean;
  is_applied_in_new_item: boolean;
  percentage: number;


};

declare type BreadType = {
  path: string;
  imgIcon: string;
  name: string;
};
declare type Area = {
  id: number | string;
  name: string;
};
declare type StoreType = {
  id: number | string;
  name: string;
  complete_name: string;
  currency: number | string;
};

declare type UserType = {
  id: number | string;
  full_name: string;
  points: number;
  phone_code: string;
  phone: string;
  profile: any;
  email: string;
  city: string;
  is_active: boolean;
};
declare type AddressType = {
  id: number | string;
  name?: string;
  title: string;
  desc?: string;
  lat: number;
  lng: number;
};

declare type AggregatorType = {
  id: number | string;
  name: string;
};

declare type SimpleTable = {
  table_type?: string;
  table_num: string | number;
  id: string | number;
  status: string;
  created_at: string;
  num_of_guests: string | number;
  with_order: boolean;
  current_order: any;
};

declare type TableType = {
  table_type?: string;
  created_at: string;
  type: string;
  status: string;
  area: Area;
  table_num: string | number;
  split_tables: SimpleTable[];
  merged_tables: SimpleTable[];
  id: number | string;
  num_of_guests: string | number;
  with_order: boolean;
  current_order: any;
  active_reservation: any;
  available_chairs: number;
};

declare type ItemModifiers = {
  sub_modifier_id: number;
  qty: number;
  item_modifier_id: number;
  quantity: number;
  id: number;
};
declare type SubModifiers = {
  id: number;
  item_modifiers: ItemModifiers[];
};
declare type ComboTypeProduct = {
  id: number;
  product_id: number;
  qty: number;
  quantity: number;
};
declare type ComboType = {
  product: ComboTypeProduct[];
  combo_id: number;
  product_id: number;
  id: number;
  qty: number;
  quantity: number;
};

declare type CartItem = {
  id: number;
  item_id: number;
  status: string;
  old_status?: string;
  name: string;
  uuid?: string | number;
  price: string | number;
  cart_type: string;
  type: string;
  product_id: number;
  quantity: string | number;
  note: string;
  total_price: number;
  sub_price: number;
  desc: string;
  combo: ComboType[];
  sub_modifiers: SubModifiers[];
  item_modifires: ItemModifiers[];
  qty: number;
};

declare type PaymentType = {
  [type: string]: string | number;
};
declare type DiscountType = {
  amount_value: number;
  amount_type: string;
  min_order_cost: number;
  max_value: number;
  have_surcharge: boolean;
  id: number;
};

declare type ModifyReason = {
  desc: string;
  id: number;
};
declare type CartType = {
  order_id?: number;
  store_id: number;
  id: number;
  note: string;
  status: string;
  status_trans: string;
  internal_note_to: string;
  internal_note: string;
  is_schedule: boolean;
  is_payment: boolean | number;
  address_id?: AddressType;
  order_type: string;
  assign_at: string;
  order_date: string;
  table_cover: string;
  table_type?: string;
  order_time: string;
  modify_reason: any;
  modify_status: string;
  order_num: string | number;
  table_id: TableType;
  table: TableType;
  merged_table_ids: SimpleTable[];
  split_table_id: SimpleTable;
  selected_table: TableType;
  user_id?: UserType;
  waiter?: UserType;
  driver_id?: UserType;
  aggregator_id?: AggregatorType;
  cart: CartItem[];
  item: CartItem[];
  order_discount: DiscountType | null;
  order_discount_id: DiscountType | null;
  payment_type: PaymentType[];
  order_summary: orderSummaryType;
  price_detail: orderSummaryType;
};
declare type OrderType = {
  pay_type: any;
  order_id: number | string;
  store_id: number;
  id: number;
  note: string;
  platform: string;
  store: StoreType;
  status: string;
  open_items: CartItem[];
  status_trans: string;
  internal_note_to: string;
  internal_note: string;
  modify_reason: null;
  modify_status: string;
  is_schedule: boolean;
  is_payment: boolean | number;
  address_id?: AddressType;
  address?: AddressType;
  order_type: string;
  assign_at: string;
  order_date: string;
  table_cover: string;
  table_type?: string;
  order_time: string;
  order_num: string | number;
  table_id: TableType;
  table: TableType;
  merged_table_ids: SimpleTable[];
  split_table_id?: SimpleTable;
  selected_table?: TableType;
  user_id?: UserType;
  employee: UserType;
  user: UserType;

  waiter?: UserType;
  driver_id?: UserType;
  aggregator_id?: AggregatorType;
  cart: CartItem[];
  item: CartItem[];
  order_discount: DiscountType | null;
  order_discount_id: DiscountType | null;
  payment_type: PaymentType[];
  order_summary: orderSummaryType;
  price_detail: orderSummaryType;
};
declare type OrderBillType = {
  cart: CartItem[];
  payment_type: PaymentType[];
  paid: PaymentType[];
  order_summary: orderSummaryType;
  order_discount_id: DiscountType | null;
  order_discount: DiscountType | null;
  bill_splitted?: boolean;
  user_id?: UserType;
  order_id?: number;
  order_type: string;
  currency: string;
  is_payment: boolean;
  total_paid: number;

};

declare type orderSummaryType = {
  [key: string]: number | string | boolean | undefined;
  sub_total: number;
  sub_after_discound_total: number;
  surcharge_value: number;
  discount_value: number;
  currency?: string;
  tips: number;
  points: number;
  cash: number;
  tax_rate_percentage: number;
  tax_rate_value: number;
  credit: number;
  customer_credit: number;
  remain_amount: number;
  total_amount: number;
  tax_value: number;
  tax_precentage: number;
  delivery_price: number;
  is_paid: boolean;
  total_price: number;
};

declare type PosStore = {
  pos_settings: any;

  pos_store: StoreType;
  orderBill: OrderBillType;
  cart: CartType;
  drivers: unknown[];
  allCustomers: unknown[];
  customers: UserType[];
  tables: TableType[];
  customersPaginator: any;
  itemToUpdate: TableType | null;
  tableToSpilt: TableType | null;
  areas: Area[];
  splitModal: boolean;
  driverModal: boolean;
  creditCustomerDetails: boolean;
  addressModal: boolean;
  tableInformationModal: boolean;
  customerModal: boolean;
  openAddCustomerModal: boolean;
  driversLoading: boolean;
  customersLoading: boolean;
  customerPointsModal: boolean;
  areasLoading: boolean;
  surcharge: SurchargeType | null;
  taxs: TaxsType | null;
  deliveryPrice: number;
  tablesLoading: boolean;
  addAddressModal: boolean;
  route: any;
  products: any[];
  categories: any[];
  sub_categories: any[];
  first_run: boolean;
  initLoading: boolean;
};

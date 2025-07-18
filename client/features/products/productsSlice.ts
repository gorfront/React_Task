import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/api";

export interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  image?: string;
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  { search?: string } | undefined
>("products/fetchAll", async (params, thunkAPI) => {
  try {
    const res = await api.get("/products", {
      params: params?.search ? { search: params.search } : {},
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to load products");
  }
});

export const createProduct = createAsyncThunk(
  "products/create",
  async (
    data: {
      name: string;
      price: number;
      discountPrice?: number;
      description?: string;
      image?: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await api.post("/products", data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to create product");
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getById",
  async (id: string, thunkAPI) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Not found");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }: { id: string; data: any }, thunkAPI) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Update failed");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch {
      return thunkAPI.rejectWithValue("Failed to delete product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export default productsSlice.reducer;

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { ProductItem } from "@/components/ProductItem";
interface Category {
  id: number;
  name: string;
  image: string;
}
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}
export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/categories/all`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/products/random`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              limit: "10",
            }).toString(),
          }
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategorySelect = async (categoryId: number) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/products/filter?categoryId=${categoryId}&name=${inputSearch}`,
        {
          method: "GEt",
        }
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const handleSubmitSearch = async () => {
    try {
      router.push(`../search/${inputSearch}`);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const handleSignUp = () => {
    router.push("../login");
  };
  return (
    <ScrollView className="flex-1 bg-white px-4">
      {/* Thanh tìm kiếm */}
      <View className="mt-5 mb-3 flex-row items-center">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg p-3 bg-gray-100"
          placeholder="Tìm kiếm sản phẩm..."
          value={inputSearch}
          onChangeText={setInputSearch}
          onSubmitEditing={handleSubmitSearch}
        />
        <TouchableOpacity className="ml-3 p-2">
          <AntDesign
            name="user"
            size={24}
            color="black"
            onPress={handleSignUp}
          />
        </TouchableOpacity>
      </View>

      {/* Banner quảng cáo */}
      <View>
        <Image
          className="w-full h-20"
          source={require("@/assets/images/banner.jpg")}
        />
      </View>

      {/* Danh mục sản phẩm */}
      <Text className="text-lg font-bold mb-3">Danh mục sản phẩm</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-5"
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            className="mr-5 items-center"
            onPress={() => handleCategorySelect(category.id)}
          >
            <Image
              source={{
                uri: category.image,
              }}
              className="w-20 h-20 rounded-full"
            />
            <Text className="mt-2 text-sm">{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sản phẩm */}
      <Text className="text-lg font-bold mb-3">Sản phẩm</Text>
      <View className="flex-row flex-wrap justify-between">
        {products.map((product, index) => (
          <ProductItem
            key={index}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </View>
    </ScrollView>
  );
}

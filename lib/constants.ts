import { Product } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "100% Bonus টপআপ ইভেন্ট",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80",
    category: "Hot",
    packages: [
      { amount: "100 Diamond", price: 80 },
      { amount: "200 Diamond", price: 150 },
    ],
    inputLabel: "Player Id",
    inputPlaceholder: "Enter Player Id",
    rules: ["শুধুমাত্র BD সার্ভারে টপআপ হবে।"],
  },
  {
    id: "2",
    name: "Uid Topup [BD SERVER]",
    price: 20,
    image:
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=200&q=80",
    category: "Hot",
    packages: [
      { amount: "25 Diamond", price: 20 },
      { amount: "50 Diamond", price: 35 },
      { amount: "115 Diamond", price: 76 },
      { amount: "240 Diamond", price: 152 },
      { amount: "Monthly", price: 745 },
    ],
    inputLabel: "Player Id",
    inputPlaceholder: "Player Id",
    rules: [
      "শুধুমাত্র Bangladesh সার্ভারে ID Code দিয়ে টপ আপ হবে।",
      "Player ID Code ভুল হলে ডায়মন্ড পাবেন না।",
    ],
  },
  {
    id: "3",
    name: "UNIPIN VOUCHER (BDT)",
    price: 100,
    image:
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=200&q=80",
    category: "Hot",
    packages: [
      { amount: "25 Diamond Code", price: 20 },
      { amount: "50 Diamond Code", price: 35 },
      { amount: "115 Diamond Code", price: 76 },
      { amount: "Weekly Code", price: 150 },
    ],
    inputLabel: "",
    inputPlaceholder: "",
    hasQuantity: true,
    rules: [
      "শুধুমাত্র BD সার্ভারে VOUCHER দিয়ে টপ আপ হবে।",
      "কোড রিডিম করুন shop.garena.my থেকে।",
    ],
  },
  {
    id: "4",
    name: "Weekly/Monthly",
    price: 175,
    image:
      "https://images.unsplash.com/photo-1633259584604-af77143d799a?auto=format&fit=crop&w=200&q=80",
    category: "Hot",
    packages: [
      { amount: "Weekly", price: 150 },
      { amount: "Monthly", price: 745 },
      { amount: "2X Weekly", price: 300 },
      { amount: "3Weekly + 1Monthly", price: 1195 },
    ],
    inputLabel: "Player Id",
    inputPlaceholder: "Player Id",
    rules: ["শুধুমাত্র Bangladesh সার্ভারে ID Code দিয়ে টপ আপ হবে।"],
  },
  {
    id: "5",
    name: "Level Up Pass BD",
    price: 210,
    image:
      "https://images.unsplash.com/photo-1628151015968-3a4484519056?auto=format&fit=crop&w=200&q=80",
    category: "Games",
    packages: [
      { amount: "Level up pass [Lv.6]", price: 40 },
      { amount: "Level up pass [Lv.10]", price: 70 },
      { amount: "Level up pass [Lv.30]", price: 100 },
    ],
    inputLabel: "আপনার গেমের uid",
    inputPlaceholder: "আপনার গেমের uid",
    rules: ["শুধুমাত্র Bangladesh সার্ভারে UID দিয়ে হবে।"],
  },
  {
    id: "6",
    name: "PUBG MOBILE UC",
    price: 95,
    image:
      "https://images.unsplash.com/photo-1593305841991-05c29736ce37?auto=format&fit=crop&w=200&q=80",
    category: "Games",
    packages: [
      { amount: "PUBG 60 UC", price: 120 },
      { amount: "PUBG 325 UC", price: 580 },
      { amount: "PUBG 1800 UC", price: 2950 },
    ],
    inputLabel: "আপনার প্লেয়ার আইডি",
    inputPlaceholder: "আপনার প্লেয়ার আইডি",
    rules: ["PUBG Global/KR/VN Uid UC Topup."],
  },
  {
    id: "7",
    name: "Weekly Lite",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80",
    category: "Games",
    packages: [{ amount: "Weekly Lite", price: 80 }],
    inputLabel: "Player Id",
    inputPlaceholder: "Player Id",
    rules: ["Lite Version"],
  },
];

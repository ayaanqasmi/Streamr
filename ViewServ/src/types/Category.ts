export type CategoryButton = {
    name: string;
    url: string;
}

export type Category = {
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}
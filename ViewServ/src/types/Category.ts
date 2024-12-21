export type CategoryButton = {
    name: string;
    url: string;
}

export type CategoryType = {
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}
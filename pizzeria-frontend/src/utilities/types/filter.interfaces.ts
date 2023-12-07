export interface Filter {
  onFilterClick: (filterType: string) => void;
}

export interface FilterItem {
  item: {
    image: string;
    alt: string;
    name: string;
  };
  onFilterClick: () => void;
}

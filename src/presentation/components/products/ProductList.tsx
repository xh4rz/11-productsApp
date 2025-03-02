import { Layout, List } from '@ui-kitten/components';
import { Product } from '../../../domain/entities/product';
import { ProductCard } from './ProductCard';

interface Props {
	products: Product[];
	fetchNextPage: () => void;
}

export const ProductList = ({ products }: Props) => {
	return (
		<List
			data={products}
			numColumns={2}
			keyExtractor={(item, index) => `${item.id}-${index}`}
			renderItem={({ item }) => <ProductCard product={item} />}
			ListFooterComponent={() => <Layout style={{ height: 150 }} />}
		/>
	);
};

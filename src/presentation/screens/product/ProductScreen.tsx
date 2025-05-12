import { useRef } from 'react';
import {
	Button,
	ButtonGroup,
	Input,
	Layout,
	useTheme
} from '@ui-kitten/components';
import { MainLayout } from '../../layouts/MainLayout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	getProductById,
	updateCreateProduct
} from '../../../actions/auth/products';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { ScrollView } from 'react-native-gesture-handler';
import { Product } from '../../../domain/entities/product';
import { MyIcon } from '../../components/ui/MyIcon';
import { Formik } from 'formik';
import { ProductImages } from '../../components/products/ProductImages';
import { genders, sizes } from '../../../config/constants/constants';

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}

export const ProductScreen = ({ route }: Props) => {
	const productIdRef = useRef(route.params.productId);

	const theme = useTheme();

	const queryClient = useQueryClient();

	const { data: product } = useQuery({
		queryKey: ['product', productIdRef.current],
		queryFn: () => getProductById(productIdRef.current)
	});

	const mutation = useMutation({
		mutationFn: (data: Product) =>
			updateCreateProduct({ ...data, id: productIdRef.current }),
		onSuccess: (data: Product) => {
			productIdRef.current = data.id; // creación de producto
			queryClient.invalidateQueries({ queryKey: ['products', 'infinite'] });
			queryClient.invalidateQueries({ queryKey: ['product', data.id] });
			// queryClient.setQueryData(['product', data.id], data);
		}
	});

	if (!product) {
		return <MainLayout title="Cargando..." />;
	}

	return (
		<Formik initialValues={product} onSubmit={mutation.mutate}>
			{({ handleChange, handleSubmit, values, setFieldValue }) => (
				<MainLayout
					title={values.title}
					subTitle={`Precio: ${values.price}`}
					rightAction={() => console.log('hola mundo')}
					rightActionIcon="camera-outline">
					<ScrollView style={{ flex: 1 }}>
						<Layout
							style={{
								marginVertical: 10,
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<ProductImages images={values.images} />
						</Layout>

						<Layout style={{ marginHorizontal: 10 }}>
							<Input
								label="Título"
								value={values.title}
								onChangeText={handleChange('title')}
								style={{ marginVertical: 5 }}
							/>
							<Input
								label="Slug"
								value={values.slug}
								onChangeText={handleChange('slug')}
								style={{ marginVertical: 5 }}
							/>
							<Input
								multiline
								label="Descripción"
								value={values.description}
								onChangeText={handleChange('description')}
								numberOfLines={5}
								style={{ marginVertical: 5 }}
							/>
						</Layout>

						<Layout
							style={{
								marginVertical: 5,
								marginHorizontal: 15,
								flexDirection: 'row',
								gap: 10
							}}>
							<Input
								label="Precio"
								value={values.price.toString()}
								onChangeText={handleChange('price')}
								style={{ flex: 1 }}
								keyboardType="numeric"
							/>
							<Input
								label="Inventario"
								value={values.stock.toString()}
								onChangeText={handleChange('stock')}
								style={{ flex: 1 }}
								keyboardType="numeric"
							/>
						</Layout>

						<ButtonGroup
							style={{
								margin: 2,
								marginTop: 20,
								marginHorizontal: 15
							}}
							size="small"
							appearance="outline">
							{sizes.map(size => (
								<Button
									onPress={() =>
										setFieldValue(
											'sizes',
											values.sizes.includes(size)
												? values.sizes.filter(s => s !== size)
												: [...values.sizes, size]
										)
									}
									key={size}
									style={{
										flex: 1,
										backgroundColor: values.sizes.includes(size)
											? theme['color-primary-200']
											: undefined
									}}>
									{size}
								</Button>
							))}
						</ButtonGroup>

						<ButtonGroup
							style={{
								margin: 2,
								marginTop: 20,
								marginHorizontal: 15
							}}
							size="small"
							appearance="outline">
							{genders.map(gender => (
								<Button
									onPress={() => setFieldValue('gender', gender)}
									key={gender}
									style={{
										flex: 1,
										backgroundColor: values.gender.startsWith(gender)
											? theme['color-primary-200']
											: undefined
									}}>
									{gender}
								</Button>
							))}
						</ButtonGroup>

						<Button
							accessoryLeft={<MyIcon name="save-outline" white />}
							onPress={() => handleSubmit()}
							disabled={mutation.isPending}
							style={{ margin: 15 }}>
							Guardar
						</Button>

						<Layout style={{ height: 200 }} />
					</ScrollView>
				</MainLayout>
			)}
		</Formik>
	);
};

import {
	Button,
	ButtonGroup,
	Input,
	Layout,
	Text,
	useTheme
} from '@ui-kitten/components';
import { MainLayout } from '../../layouts/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../../../actions/auth/products/get-product-by-id';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { FadeInImage } from '../../components/ui/FadeInImage';
import { FlatList } from 'react-native';
import { Gender, Size } from '../../../domain/entities/product';
import { MyIcon } from '../../components/ui/MyIcon';
import { Formik } from 'formik';

const sizes: Size[] = [Size.Xs, Size.S, Size.M, Size.L, Size.Xl, Size.Xxl];

const genders: Gender[] = [Gender.Kid, Gender.Men, Gender.Women, Gender.Unisex];

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}

export const ProductScreen = ({ route }: Props) => {
	const productIdRef = useRef(route.params.productId);

	const theme = useTheme();

	const { data: product } = useQuery({
		queryKey: ['product', productIdRef.current],
		queryFn: () => getProductById(productIdRef.current)
	});

	if (!product) {
		return <MainLayout title="Cargando..." />;
	}

	return (
		<Formik initialValues={product} onSubmit={values => console.log(values)}>
			{({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
				<MainLayout title={values.title} subTitle={`Precio: ${values.price}`}>
					<ScrollView style={{ flex: 1 }}>
						<Layout>
							<FlatList
								data={values.images}
								keyExtractor={item => item}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => (
									<FadeInImage
										uri={item}
										style={{ width: 300, height: 300, marginHorizontal: 7 }}
									/>
								)}
							/>
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
							/>
							<Input
								label="Inventario"
								value={values.stock.toString()}
								onChangeText={handleChange('stock')}
								style={{ flex: 1 }}
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
							onPress={() => console.log('Guardar')}
							style={{ margin: 15 }}>
							Guardar
						</Button>

						<Text>{JSON.stringify(values, null, 2)}</Text>

						<Layout style={{ height: 200 }} />
					</ScrollView>
				</MainLayout>
			)}
		</Formik>
	);
};

import Prismic from 'prismic-javascript';
import { useCart } from '../components/CartContext';
import Header from '../components/Header';
import Product from '../components/Product';
import Head from 'next/head';

const Index = ({ products }) => {
    const cart = useCart();
    return (
        <>
            <Head>
                <title>Home | Ora do Rango</title>
            </Head>
            <Header />
            <div className="mt-6">
                <main className="grid grid-flow-col grid-cols-3 gap-2">
                    {products.map((product, index) => {
                        return (
                            <Product
                                key={product.id}
                                product={product}
                                index={index}
                            />
                        )
                    })}
                </main>
            </div>

        </>
    );
}

export async function getServerSideProps({ res }) {
    const client = Prismic.client('https://orarango.cdn.prismic.io/api/v2');
    const products = await client.query(Prismic.Predicates.at('document.type', 'product'));

    return {
        props: {

            products: products.results
        },
    }

}

export default Index;


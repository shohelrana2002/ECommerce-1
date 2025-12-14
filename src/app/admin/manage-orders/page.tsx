import MangeProductsTable from "./components/MangeProductsTable";

export default async function ManageOrdersPage() {
  // await connectDB();
  // const products = await Grocery.find({});
  return (
    <>
      <MangeProductsTable />
    </>
  );
}

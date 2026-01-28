
$product = App\Models\Product::where("slug", "massazer-dlya-lica-yovee-gummy-peach-rozovyi-v-pakete-ut-00008191")->first();
$controller = new App\Http\Controllers\ProductDescriptionController();
$response = $controller->enhance($product);
echo json_encode($response->getData());


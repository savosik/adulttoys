
$product = App\Models\Product::whereNull("key_benefits")->where("slug", "!=", "massazer-dlya-lica-yovee-gummy-peach-rozovyi-v-pakete-ut-00008191")->first();
if (!$product) $product = App\Models\Product::first();
echo "Testing on product: " . $product->name . "\n";
$provider = new \NeuronAI\Providers\OpenAILike(
    baseUri: config("neuron.provider.openrouter.base_uri"),
    key: config("neuron.provider.openrouter.key"),
    model: "google/gemini-2.0-flash-001"
);
$agent = new \NeuronAI\Agent();
$agent->setAiProvider($provider);

$prompt = "Generate 3 realistic customer reviews in Russian (4-5 stars) highlighting benefits. Product: {$product->name}. Return JSON array in reviews key.";
$response = $agent->chat(new \NeuronAI\Chat\Messages\UserMessage($prompt));
echo $response->getContent();


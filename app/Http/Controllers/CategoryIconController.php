<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;

class CategoryIconController extends Controller
{
    public function setIcon(Request $request)
    {
        $request->validate([
            'image_url' => 'required|string',
            'crop_data' => 'required|array',
            'crop_data.x' => 'required|numeric',
            'crop_data.y' => 'required|numeric',
            'crop_data.width' => 'required|numeric|min:1',
            'crop_data.height' => 'required|numeric|min:1',
            'zoom_level' => 'nullable|numeric',
            'category_id' => 'nullable|integer',
            'category_slug' => 'nullable|string',
        ]);

        // Determine which category to update
        $category = null;
        
        if ($request->category_id) {
            $category = Category::find($request->category_id);
        } elseif ($request->category_slug) {
            $category = Category::where('slug', $request->category_slug)->first();
        }

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Категория не найдена'
            ], 404);
        }

        try {
            // Download the image
            $imageUrl = $request->image_url;
            
            // Handle relative URLs
            if (str_starts_with($imageUrl, '/')) {
                $imageUrl = config('app.url') . $imageUrl;
            }
            
            $response = Http::timeout(30)->get($imageUrl);
            
            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Не удалось загрузить изображение'
                ], 400);
            }

            $imageContent = $response->body();
            
            // Get crop data from frontend
            $cropData = $request->crop_data;
            $cropX = (int) round($cropData['x']);
            $cropY = (int) round($cropData['y']);
            $cropWidth = (int) round($cropData['width']);
            $cropHeight = (int) round($cropData['height']);
            
            // Process with Intervention Image v3
            $manager = ImageManager::gd();
            $sourceImage = $manager->read($imageContent);
            
            $srcWidth = $sourceImage->width();
            $srcHeight = $sourceImage->height();
            
            // Check if crop area extends beyond image bounds
            $needsPadding = $cropX < 0 || $cropY < 0 || 
                           ($cropX + $cropWidth) > $srcWidth || 
                           ($cropY + $cropHeight) > $srcHeight;
            
            if ($needsPadding) {
                // Create a white canvas with crop dimensions
                $canvas = $manager->create($cropWidth, $cropHeight)->fill('#ffffff');
                
                // Calculate where to place the source image on the canvas
                $pasteX = max(0, -$cropX);
                $pasteY = max(0, -$cropY);
                
                // Calculate what part of the source to use
                $sourceStartX = max(0, $cropX);
                $sourceStartY = max(0, $cropY);
                $sourceEndX = min($srcWidth, $cropX + $cropWidth);
                $sourceEndY = min($srcHeight, $cropY + $cropHeight);
                $sourceUseWidth = $sourceEndX - $sourceStartX;
                $sourceUseHeight = $sourceEndY - $sourceStartY;
                
                if ($sourceUseWidth > 0 && $sourceUseHeight > 0) {
                    // Crop the visible part from source
                    $croppedPart = $sourceImage->crop(
                        $sourceUseWidth, 
                        $sourceUseHeight, 
                        $sourceStartX, 
                        $sourceStartY
                    );
                    
                    // Place it on the white canvas
                    $canvas->place($croppedPart, 'top-left', $pasteX, $pasteY);
                }
                
                $image = $canvas;
            } else {
                // Normal crop - image fully contains crop area
                $image = $sourceImage->crop($cropWidth, $cropHeight, $cropX, $cropY);
            }
            
            // Resize to 256x256
            $image->resize(256, 256);
            
            // Save as WebP
            $filename = "icons/category-{$category->id}.webp";
            $encoded = $image->toWebp(90);
            
            Storage::disk('public')->put($filename, (string) $encoded);
            
            // Update category icon field
            $category->icon = $filename;
            $category->save();

            return response()->json([
                'success' => true,
                'message' => 'Иконка категории обновлена',
                'icon_url' => $category->icon_url
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при обработке изображения: ' . $e->getMessage()
            ], 500);
        }
    }
}

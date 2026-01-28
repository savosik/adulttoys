<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['categories'] as $item) {
            Category::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('message', 'Порядок категорий обновлен');
    }

    public function toggleHidden(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:categories,id',
        ]);

        $category = Category::findOrFail($validated['id']);
        $category->update([
            'is_hidden' => !$category->is_hidden
        ]);

        return back()->with('message', 'Видимость категории обновлена');
    }
}

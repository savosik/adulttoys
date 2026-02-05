

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Update the user's currency.
     */
    public function updateCurrency(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'currency_id' => 'required|exists:currencies,id',
        ]);

        $user->update(['currency_id' => $validated['currency_id']]);

        return response()->json([
            'message' => 'Currency updated successfully',
            'user' => $user->load('currency'),
        ]);
    }
    
    // Keeping the generic update for future use if needed, but focusing on currency for now to be safe
     public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        // Validate request data
        $validated = $request->validate([
            'currency_id' => 'sometimes|nullable|exists:currencies,id',
            // Add other fields if necessary
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}
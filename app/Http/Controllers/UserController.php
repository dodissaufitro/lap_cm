<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ChecksRoles;
use App\Models\User;
use App\Support\ActivityLogger;
use App\Support\FormOptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    use ChecksRoles;

    public function index(Request $request): Response
    {
        $this->ensureAdmin();

        $search = $request->string('search')->toString();
        $role = $request->string('role')->toString();

        $items = User::query()
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->when($role, fn ($q) => $q->where('role', $role))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('users/index', [
            'items' => $items,
            'filters' => ['search' => $search, 'role' => $role],
            'roleOptions' => FormOptions::userRoles(),
        ]);
    }

    public function create(): Response
    {
        $this->ensureAdmin();

        return Inertia::render('users/create', [
            'roleOptions' => FormOptions::userRoles(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::enum(UserRole::class)],
            'is_active' => 'required|boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::query()->create($validated);

        ActivityLogger::log("Pengguna \"{$user->name}\" ditambahkan", $user);

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function show(User $user): Response
    {
        $this->ensureAdmin();

        return Inertia::render('users/show', [
            'item' => $user,
        ]);
    }

    public function edit(User $user): Response
    {
        $this->ensureAdmin();

        return Inertia::render('users/edit', [
            'item' => $user,
            'roleOptions' => FormOptions::userRoles(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::enum(UserRole::class)],
            'is_active' => 'required|boolean',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        ActivityLogger::log("Pengguna \"{$user->name}\" diperbarui", $user);

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->ensureAdmin();

        abort_if($user->id === $this->user()->id, 403, 'Tidak dapat menghapus akun sendiri.');

        $nama = $user->name;
        $user->delete();

        ActivityLogger::log("Pengguna \"{$nama}\" dihapus");

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil dihapus.');
    }
}

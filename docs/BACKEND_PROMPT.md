# TERATUR.ID - Backend Development Guide (Flask)

## 📋 Deskripsi Aplikasi

TERATUR.ID adalah aplikasi manajemen keuangan bisnis UMKM (fokus F&B) yang menghitung **HPP (Harga Pokok Penjualan)** per produk secara detail. Aplikasi ini membantu pemilik usaha memahami biaya produksi, margin keuntungan, dan laporan keuangan.

---

## 🏗️ Arsitektur Sistem

```
Frontend (React + Vite)  ←→  Backend (Flask REST API)  ←→  Database (PostgreSQL)
     Port 5173                    Port 5000                    Port 5432
```

### Tech Stack Backend
- **Framework**: Flask
- **ORM**: Flask-SQLAlchemy  
- **Migration**: Flask-Migrate (Alembic)
- **Auth**: Flask-JWT-Extended (JWT Token)
- **Password**: Bcrypt
- **CORS**: Flask-CORS
- **Export**: openpyxl (Excel), csv (built-in)

### Install Dependencies
```bash
pip install flask flask-sqlalchemy flask-migrate flask-jwt-extended flask-cors flask-bcrypt openpyxl psycopg2-binary python-dotenv
```

---

## 🔐 Autentikasi & Otorisasi

### Alur Kerja:
1. User register → password di-hash dengan bcrypt → simpan ke DB
2. User login → validasi email+password → return JWT access token
3. Setiap request ke protected endpoint → kirim token di header `Authorization: Bearer <token>`
4. Backend decode token → ambil user_id dan role → cek akses

### Roles & Akses Menu:

| Fitur | Manager | Cashier |
|-------|---------|---------|
| Dashboard (KPI, chart) | ✅ Full | ✅ Read-only |
| Produk (CRUD, resep, HPP) | ✅ | ❌ |
| Pengeluaran - Semua kategori | ✅ | ❌ |
| Pengeluaran - Pembelian bahan baku | ✅ | ✅ |
| Karyawan (CRUD, BTKL) | ✅ | ❌ |
| Transaksi / POS | ❌ | ✅ |
| Chat AI | ✅ | ❌ |
| Laporan & Export | ✅ | ❌ |
| Pengaturan Bisnis | ✅ | ❌ |

### Endpoints Auth:
```
POST /api/auth/register
  Body: { name, email, password, role }
  Validasi:
    - email unik
    - password min 6 karakter
    - role hanya 'manager' atau 'cashier'
  Response: { user: { id, name, email, role }, access_token }

POST /api/auth/login
  Body: { email, password }
  Response: { user: { id, name, email, role }, access_token }

GET /api/auth/me
  Header: Authorization: Bearer <token>
  Response: { id, name, email, role }

POST /api/auth/logout
  → Invalidate token (blacklist di DB atau redis)

PUT /api/auth/change-password
  Header: Authorization: Bearer <token>
  Body: { current_password, new_password }
  Validasi: current_password harus cocok
  Response: { message: "Password berhasil diubah" }
```

### Implementasi Auth:
```python
# app/routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from app.models.user import User
from app import db

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
bcrypt = Bcrypt()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validasi
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Nama, email, dan password wajib diisi"}), 400
    
    if len(data['password']) < 6:
        return jsonify({"error": "Password minimal 6 karakter"}), 400
    
    if data.get('role') not in ['manager', 'cashier']:
        return jsonify({"error": "Role harus 'manager' atau 'cashier'"}), 400
    
    existing = User.query.filter_by(email=data['email']).first()
    if existing:
        return jsonify({"error": "Email sudah terdaftar"}), 409
    
    password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    user = User(
        name=data['name'],
        email=data['email'],
        password_hash=password_hash,
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id, additional_claims={"role": user.role})
    
    return jsonify({
        "user": user.to_dict(),
        "access_token": access_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not user.is_active:
        return jsonify({"error": "Email atau password salah"}), 401
    
    if not bcrypt.check_password_hash(user.password_hash, data.get('password', '')):
        return jsonify({"error": "Email atau password salah"}), 401
    
    access_token = create_access_token(identity=user.id, additional_claims={"role": user.role})
    
    return jsonify({
        "user": user.to_dict(),
        "access_token": access_token
    })

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User tidak ditemukan"}), 404
    return jsonify(user.to_dict())

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    
    if not bcrypt.check_password_hash(user.password_hash, data.get('current_password', '')):
        return jsonify({"error": "Password lama salah"}), 400
    
    if len(data.get('new_password', '')) < 6:
        return jsonify({"error": "Password baru minimal 6 karakter"}), 400
    
    user.password_hash = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
    db.session.commit()
    
    return jsonify({"message": "Password berhasil diubah"})
```

---

## 🔒 Middleware & Security Decorators

```python
# app/utils/decorators.py
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from functools import wraps
from flask import jsonify
from app.models.user import User

def role_required(*roles):
    """Decorator untuk membatasi akses berdasarkan role"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role')
            if user_role not in roles:
                return jsonify({"error": f"Akses ditolak. Hanya {', '.join(roles)}."}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

def manager_required(f):
    """Shortcut: hanya manager yang bisa akses"""
    return role_required('manager')(f)

def cashier_required(f):
    """Shortcut: hanya cashier yang bisa akses"""
    return role_required('cashier')(f)

def any_authenticated(f):
    """Semua user yang sudah login bisa akses"""
    return role_required('manager', 'cashier')(f)
```

### CORS Config:
```python
from flask_cors import CORS
CORS(app, origins=[
    "http://localhost:5173",      # Dev
    "https://your-domain.com"     # Production
])
```

---

## 📦 Modul & Endpoint API

### 1. Products (Produk) — Manager Only

Produk memiliki **resep** (ingredients) yang terhubung ke raw_materials. HPP dihitung dari:
- **BBB** (Biaya Bahan Baku) = total cost semua ingredients
- **BTKL** (Biaya Tenaga Kerja Langsung) = dari alokasi karyawan produksi
- **BOP** (Biaya Overhead Produksi) = overhead_cost manual
- **HPP** = BBB + BTKL + BOP
- **Margin** = ((selling_price - HPP) / selling_price) × 100

```
GET    /api/products              → List semua produk (manager only)
GET    /api/products/:id          → Detail produk + ingredients + BTKL breakdown
POST   /api/products              → Tambah produk baru + ingredients
PUT    /api/products/:id          → Edit produk + ingredients
DELETE /api/products/:id          → Soft delete (is_active=false)
```

#### Contoh Body POST/PUT:
```json
{
  "name": "Kopi Susu Gula Aren",
  "description": "Kopi susu dengan gula aren asli",
  "selling_price": 25000,
  "overhead_cost": 500,
  "stock_current": 85,
  "ingredients": [
    { "material_id": 1, "quantity": 10, "unit": "g", "category": "bahan_baku" },
    { "material_id": 3, "quantity": 20, "unit": "g", "category": "bahan_baku" },
    { "material_id": 4, "quantity": 1, "unit": "pcs", "category": "kemasan" }
  ]
}
```

#### Implementasi Products:
```python
# app/routes/products.py
from flask import Blueprint, request, jsonify
from app.utils.decorators import manager_required
from app.services.hpp_calculator import calculate_hpp
from app.models.product import Product
from app.models.product_ingredient import ProductIngredient
from app.models.raw_material import RawMaterial
from app import db

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('', methods=['GET'])
@manager_required
def list_products():
    products = Product.query.filter_by(is_active=True).all()
    return jsonify([p.to_dict_with_ingredients() for p in products])

@products_bp.route('/<int:product_id>', methods=['GET'])
@manager_required
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict_with_ingredients())

@products_bp.route('', methods=['POST'])
@manager_required
def create_product():
    data = request.get_json()
    
    # Validasi
    if not data.get('name') or not data.get('selling_price'):
        return jsonify({"error": "Nama dan harga jual wajib diisi"}), 400
    
    # Hitung HPP dari ingredients
    ingredients_data = data.get('ingredients', [])
    bbb = 0
    for ing in ingredients_data:
        material = RawMaterial.query.get(ing['material_id'])
        if not material:
            return jsonify({"error": f"Bahan dengan ID {ing['material_id']} tidak ditemukan"}), 404
        ing['cost'] = material.price_per_unit * ing['quantity']
        bbb += ing['cost']
    
    overhead = data.get('overhead_cost', 0)
    hpp = bbb + overhead  # BTKL ditambahkan via alokasi terpisah
    margin = ((data['selling_price'] - hpp) / data['selling_price']) * 100 if data['selling_price'] > 0 else 0
    
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        selling_price=data['selling_price'],
        hpp=round(hpp, 2),
        margin_percent=round(margin, 1),
        stock_current=data.get('stock_current', 0),
        is_active=True
    )
    db.session.add(product)
    db.session.flush()  # Get product.id
    
    # Insert ingredients
    for ing in ingredients_data:
        ingredient = ProductIngredient(
            product_id=product.id,
            material_id=ing['material_id'],
            category=ing.get('category', 'bahan_baku'),
            quantity=ing['quantity'],
            unit=ing['unit'],
            cost=ing['cost']
        )
        db.session.add(ingredient)
    
    db.session.commit()
    return jsonify(product.to_dict_with_ingredients()), 201

@products_bp.route('/<int:product_id>', methods=['PUT'])
@manager_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.selling_price = data.get('selling_price', product.selling_price)
    product.stock_current = data.get('stock_current', product.stock_current)
    
    # Re-calculate ingredients if provided
    if 'ingredients' in data:
        # Delete existing
        ProductIngredient.query.filter_by(product_id=product.id).delete()
        
        bbb = 0
        for ing in data['ingredients']:
            material = RawMaterial.query.get(ing['material_id'])
            cost = material.price_per_unit * ing['quantity']
            bbb += cost
            
            ingredient = ProductIngredient(
                product_id=product.id,
                material_id=ing['material_id'],
                category=ing.get('category', 'bahan_baku'),
                quantity=ing['quantity'],
                unit=ing['unit'],
                cost=cost
            )
            db.session.add(ingredient)
        
        overhead = data.get('overhead_cost', 0)
        # Preserve existing BTKL allocation
        existing_btkl = sum(a.allocated_cost for a in product.btkl_allocations)
        product.hpp = round(bbb + existing_btkl + overhead, 2)
        product.margin_percent = round(
            ((product.selling_price - product.hpp) / product.selling_price) * 100, 1
        ) if product.selling_price > 0 else 0
    
    db.session.commit()
    return jsonify(product.to_dict_with_ingredients())

@products_bp.route('/<int:product_id>', methods=['DELETE'])
@manager_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    product.is_active = False  # Soft delete
    db.session.commit()
    return jsonify({"message": f"Produk '{product.name}' berhasil dihapus"})
```

---

### 2. Raw Materials (Bahan Baku) — Manager Only

```
GET    /api/materials              → List semua bahan
POST   /api/materials              → Tambah bahan baru
PUT    /api/materials/:id          → Edit bahan
DELETE /api/materials/:id          → Hapus bahan
```

Kategori:
- `bahan_baku` → HPP (BBB)
- `bahan_penolong` → HPP (BBB tambahan)
- `kemasan` → HPP (bagian BOP)

```python
# app/routes/materials.py
from flask import Blueprint, request, jsonify
from app.utils.decorators import manager_required
from app.models.raw_material import RawMaterial
from app import db

materials_bp = Blueprint('materials', __name__, url_prefix='/api/materials')

@materials_bp.route('', methods=['GET'])
@manager_required
def list_materials():
    materials = RawMaterial.query.all()
    return jsonify([m.to_dict() for m in materials])

@materials_bp.route('', methods=['POST'])
@manager_required
def create_material():
    data = request.get_json()
    
    if not data.get('name') or not data.get('unit'):
        return jsonify({"error": "Nama dan satuan wajib diisi"}), 400
    
    material = RawMaterial(
        name=data['name'],
        category=data.get('category', 'bahan_baku'),
        unit=data['unit'],
        price_per_unit=data.get('price_per_unit', 0),
        stock_current=data.get('stock_current', 0),
        minimum_stock=data.get('minimum_stock', 0),
        supplier=data.get('supplier'),
        description=data.get('description')
    )
    db.session.add(material)
    db.session.commit()
    return jsonify(material.to_dict()), 201

@materials_bp.route('/<int:material_id>', methods=['PUT'])
@manager_required
def update_material(material_id):
    material = RawMaterial.query.get_or_404(material_id)
    data = request.get_json()
    
    for field in ['name', 'category', 'unit', 'price_per_unit', 'stock_current', 
                  'minimum_stock', 'supplier', 'description']:
        if field in data:
            setattr(material, field, data[field])
    
    db.session.commit()
    
    # Re-calculate HPP for all products using this material
    recalculate_products_using_material(material_id)
    
    return jsonify(material.to_dict())

@materials_bp.route('/<int:material_id>', methods=['DELETE'])
@manager_required
def delete_material(material_id):
    material = RawMaterial.query.get_or_404(material_id)
    
    # Check if used in any product
    from app.models.product_ingredient import ProductIngredient
    used_count = ProductIngredient.query.filter_by(material_id=material_id).count()
    if used_count > 0:
        return jsonify({"error": f"Bahan ini digunakan di {used_count} produk. Hapus dari resep terlebih dahulu."}), 400
    
    db.session.delete(material)
    db.session.commit()
    return jsonify({"message": f"Bahan '{material.name}' berhasil dihapus"})

def recalculate_products_using_material(material_id):
    """Recalculate HPP semua produk yang menggunakan bahan ini"""
    from app.models.product_ingredient import ProductIngredient
    from app.models.product import Product
    
    ingredients = ProductIngredient.query.filter_by(material_id=material_id).all()
    product_ids = set(ing.product_id for ing in ingredients)
    
    for pid in product_ids:
        product = Product.query.get(pid)
        if not product:
            continue
        
        # Recalculate BBB
        all_ingredients = ProductIngredient.query.filter_by(product_id=pid).all()
        bbb = 0
        for ing in all_ingredients:
            mat = RawMaterial.query.get(ing.material_id)
            ing.cost = mat.price_per_unit * ing.quantity
            bbb += ing.cost
        
        # Get existing BTKL
        btkl = sum(a.allocated_cost for a in product.btkl_allocations)
        
        product.hpp = round(bbb + btkl, 2)
        product.margin_percent = round(
            ((product.selling_price - product.hpp) / product.selling_price) * 100, 1
        ) if product.selling_price > 0 else 0
    
    db.session.commit()
```

---

### 3. Employees (Karyawan) — Manager Only

Karyawan dibagi menjadi:
- **is_production_labor = true** → BTKL, biayanya masuk HPP
- **is_production_labor = false** → Non-produksi, biayanya masuk operasional

```
GET    /api/employees              → List semua karyawan
POST   /api/employees              → Tambah karyawan
PUT    /api/employees/:id          → Edit karyawan
DELETE /api/employees/:id          → Hapus (soft delete: is_active=false)
```

```python
# app/routes/employees.py
from flask import Blueprint, request, jsonify
from app.utils.decorators import manager_required
from app.models.employee import Employee
from app import db

employees_bp = Blueprint('employees', __name__, url_prefix='/api/employees')

@employees_bp.route('', methods=['GET'])
@manager_required
def list_employees():
    employees = Employee.query.filter_by(is_active=True).all()
    return jsonify([e.to_dict() for e in employees])

@employees_bp.route('', methods=['POST'])
@manager_required
def create_employee():
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({"error": "Nama wajib diisi"}), 400
    
    employee = Employee(
        name=data['name'],
        position=data.get('position'),
        department=data.get('department'),
        phone=data.get('phone'),
        wage_type=data.get('wage_type', 'daily'),
        daily_wage=data.get('daily_wage', 0),
        monthly_wage=data.get('monthly_wage', 0),
        is_production_labor=data.get('is_production_labor', False),
        join_date=data.get('join_date')
    )
    db.session.add(employee)
    db.session.commit()
    return jsonify(employee.to_dict()), 201

@employees_bp.route('/<int:employee_id>', methods=['PUT'])
@manager_required
def update_employee(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    data = request.get_json()
    
    for field in ['name', 'position', 'department', 'phone', 'wage_type',
                  'daily_wage', 'monthly_wage', 'is_production_labor', 'join_date']:
        if field in data:
            setattr(employee, field, data[field])
    
    db.session.commit()
    return jsonify(employee.to_dict())

@employees_bp.route('/<int:employee_id>', methods=['DELETE'])
@manager_required
def delete_employee(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    employee.is_active = False
    
    # Remove BTKL allocations
    from app.models.btkl_allocation import BTKLAllocation
    BTKLAllocation.query.filter_by(employee_id=employee_id).delete()
    
    db.session.commit()
    return jsonify({"message": f"Karyawan '{employee.name}' berhasil dihapus"})
```

---

### 4. BTKL Allocation (Alokasi Tenaga Kerja ke Produk) — Manager Only

Membagi biaya tenaga kerja produksi ke setiap produk berdasarkan persentase.

**Logika:**
1. Hitung total BTKL harian = SUM(daily_wage) semua karyawan is_production_labor=true
2. Distribusikan ke produk berdasarkan percentage
3. **Total percentage per karyawan HARUS = 100%**
4. BTKL per produk = SUM(daily_wage × percentage / 100) dari semua karyawan produksi
5. Update HPP produk = BBB + BTKL + BOP

```
GET  /api/btkl                    → Get alokasi saat ini per karyawan
POST /api/btkl                    → Simpan/update alokasi
  Body: {
    allocations: [
      { employee_id: 1, product_id: 1, percentage: 60 },
      { employee_id: 1, product_id: 2, percentage: 40 },
      { employee_id: 2, product_id: 1, percentage: 50 },
      { employee_id: 2, product_id: 3, percentage: 50 }
    ]
  }
```

```python
# app/routes/btkl.py
from flask import Blueprint, request, jsonify
from app.utils.decorators import manager_required
from app.models.btkl_allocation import BTKLAllocation
from app.models.employee import Employee
from app.models.product import Product
from app.models.product_ingredient import ProductIngredient
from app import db
from collections import defaultdict

btkl_bp = Blueprint('btkl', __name__, url_prefix='/api/btkl')

@btkl_bp.route('', methods=['GET'])
@manager_required
def get_allocations():
    allocations = BTKLAllocation.query.all()
    
    # Group by employee
    by_employee = defaultdict(list)
    for a in allocations:
        by_employee[a.employee_id].append(a.to_dict())
    
    employees = Employee.query.filter_by(is_production_labor=True, is_active=True).all()
    
    result = []
    for emp in employees:
        result.append({
            "employee": emp.to_dict(),
            "allocations": by_employee.get(emp.id, []),
            "total_percentage": sum(a['percentage'] for a in by_employee.get(emp.id, []))
        })
    
    return jsonify(result)

@btkl_bp.route('', methods=['POST'])
@manager_required
def save_allocations():
    data = request.get_json()
    allocations_data = data.get('allocations', [])
    
    # Validasi: total percentage per employee = 100%
    by_employee = defaultdict(float)
    for a in allocations_data:
        by_employee[a['employee_id']] += a['percentage']
    
    for emp_id, total in by_employee.items():
        if abs(total - 100) > 0.01:
            emp = Employee.query.get(emp_id)
            return jsonify({
                "error": f"Total alokasi untuk {emp.name} = {total}%. Harus tepat 100%."
            }), 400
    
    # Clear existing allocations for affected employees
    employee_ids = list(by_employee.keys())
    BTKLAllocation.query.filter(BTKLAllocation.employee_id.in_(employee_ids)).delete(synchronize_session=False)
    
    # Insert new allocations
    for a in allocations_data:
        employee = Employee.query.get(a['employee_id'])
        allocated_cost = employee.daily_wage * (a['percentage'] / 100)
        
        allocation = BTKLAllocation(
            employee_id=a['employee_id'],
            product_id=a['product_id'],
            percentage=a['percentage'],
            allocated_cost=round(allocated_cost, 2)
        )
        db.session.add(allocation)
    
    db.session.flush()
    
    # Recalculate HPP for all affected products
    affected_products = set(a['product_id'] for a in allocations_data)
    for pid in affected_products:
        recalculate_product_hpp(pid)
    
    db.session.commit()
    return jsonify({"message": "Alokasi BTKL berhasil disimpan", "updated_products": len(affected_products)})

def recalculate_product_hpp(product_id):
    """Recalculate HPP produk berdasarkan BBB + BTKL + BOP"""
    product = Product.query.get(product_id)
    if not product:
        return
    
    # BBB = total cost ingredients
    ingredients = ProductIngredient.query.filter_by(product_id=product_id).all()
    bbb = sum(ing.cost for ing in ingredients)
    
    # BTKL = total allocated_cost from all employees
    allocations = BTKLAllocation.query.filter_by(product_id=product_id).all()
    btkl = sum(a.allocated_cost for a in allocations)
    
    # BOP = overhead (stored separately or 0)
    bop = 0  # Can be stored in product table if needed
    
    product.hpp = round(bbb + btkl + bop, 2)
    product.margin_percent = round(
        ((product.selling_price - product.hpp) / product.selling_price) * 100, 1
    ) if product.selling_price > 0 else 0
```

---

### 5. Transactions / POS (Point of Sale) — Cashier Only

#### Alur POS:
1. Cashier pilih produk → tambah ke cart
2. Tentukan quantity per produk
3. Pilih metode bayar (cash/card/transfer/qris)
4. Submit → buat record di `sales` + `sale_items` + `transactions`
5. Auto-update stock produk

```
POST /api/sales                    → Buat transaksi baru (cashier only)
GET  /api/sales/my-history         → Riwayat penjualan cashier sendiri
GET  /api/products/available       → List produk untuk POS (cashier only, read-only)
```

```python
# app/routes/sales.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.decorators import cashier_required, manager_required, any_authenticated
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.models.product import Product
from app.models.transaction import Transaction
from app import db
from datetime import datetime, date

sales_bp = Blueprint('sales', __name__, url_prefix='/api/sales')

def generate_invoice_number():
    """Generate invoice: INV-YYYYMMDD-XXXX"""
    today = date.today().strftime('%Y%m%d')
    count = Sale.query.filter(
        db.func.date(Sale.created_at) == date.today()
    ).count() + 1
    return f"INV-{today}-{count:04d}"

@sales_bp.route('', methods=['POST'])
@cashier_required
def create_sale():
    data = request.get_json()
    cashier_id = get_jwt_identity()
    
    items_data = data.get('items', [])
    if not items_data:
        return jsonify({"error": "Minimal 1 produk harus dipilih"}), 400
    
    # Validasi payment method
    valid_methods = ['cash', 'card', 'transfer', 'qris']
    payment = data.get('payment_method', 'cash')
    if payment not in valid_methods:
        return jsonify({"error": f"Metode bayar harus: {', '.join(valid_methods)}"}), 400
    
    # Calculate totals
    subtotal = 0
    total_hpp = 0
    sale_items = []
    
    for item in items_data:
        product = Product.query.get(item['product_id'])
        if not product or not product.is_active:
            return jsonify({"error": f"Produk ID {item['product_id']} tidak ditemukan"}), 404
        
        qty = item['quantity']
        
        # Check stock
        if product.stock_current < qty:
            return jsonify({
                "error": f"Stok {product.name} tidak cukup. Tersedia: {product.stock_current}"
            }), 400
        
        item_subtotal = product.selling_price * qty
        item_hpp = product.hpp * qty
        subtotal += item_subtotal
        total_hpp += item_hpp
        
        sale_items.append({
            "product": product,
            "quantity": qty,
            "selling_price": product.selling_price,
            "hpp_per_unit": product.hpp,
            "subtotal": item_subtotal
        })
    
    profit = subtotal - total_hpp
    
    # Create sale record
    sale = Sale(
        invoice_number=generate_invoice_number(),
        cashier_id=cashier_id,
        payment_method=payment,
        subtotal=subtotal,
        total_amount=subtotal,  # Add tax/discount logic here
        total_hpp=total_hpp,
        profit=profit,
        notes=data.get('notes')
    )
    db.session.add(sale)
    db.session.flush()
    
    # Create sale items + update stock
    for si in sale_items:
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=si['product'].id,
            product_name=si['product'].name,
            quantity=si['quantity'],
            selling_price=si['selling_price'],
            hpp_per_unit=si['hpp_per_unit'],
            subtotal=si['subtotal']
        )
        db.session.add(sale_item)
        
        # Reduce stock
        si['product'].stock_current -= si['quantity']
    
    # Create income transaction record
    transaction = Transaction(
        type='income',
        category='lainnya',
        description=f"Penjualan {sale.invoice_number}",
        amount=subtotal,
        reference_id=sale.id,
        reference_type='sale',
        recorded_by=cashier_id,
        transaction_date=date.today()
    )
    db.session.add(transaction)
    
    db.session.commit()
    
    return jsonify({
        "message": "Transaksi berhasil",
        "sale": sale.to_dict_with_items(),
        "profit": profit
    }), 201

@sales_bp.route('/products-available', methods=['GET'])
@cashier_required
def available_products():
    """Cashier bisa lihat produk yang tersedia untuk dijual"""
    products = Product.query.filter_by(is_active=True).filter(Product.stock_current > 0).all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "selling_price": float(p.selling_price),
        "stock_current": p.stock_current,
        "hpp": float(p.hpp)
    } for p in products])

@sales_bp.route('/my-history', methods=['GET'])
@cashier_required
def my_sales_history():
    """Cashier lihat riwayat penjualan sendiri"""
    cashier_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    query = Sale.query.filter_by(cashier_id=cashier_id).order_by(Sale.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        "data": [s.to_dict_with_items() for s in pagination.items],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_items": pagination.total,
            "total_pages": pagination.pages
        }
    })
```

---

### 6. Material Purchases (Pembelian Bahan Baku) — Cashier & Manager

Cashier bisa mencatat pembelian bahan baku di halaman Pengeluaran.
Manager bisa lihat semua pengeluaran.

```
POST /api/purchases                → Catat pembelian bahan baku (cashier + manager)
GET  /api/purchases                → List pembelian (cashier: own, manager: all)
GET  /api/purchases/:id            → Detail pembelian
```

```python
# app/routes/purchases.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.utils.decorators import any_authenticated
from app.models.material_purchase import MaterialPurchase
from app.models.raw_material import RawMaterial
from app.models.transaction import Transaction
from app import db
from datetime import date

purchases_bp = Blueprint('purchases', __name__, url_prefix='/api/purchases')

@purchases_bp.route('', methods=['POST'])
@any_authenticated
def create_purchase():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    material = RawMaterial.query.get(data.get('material_id'))
    if not material:
        return jsonify({"error": "Bahan tidak ditemukan"}), 404
    
    quantity = data.get('quantity', 0)
    price = data.get('price_per_unit', material.price_per_unit)
    total = quantity * price
    
    purchase = MaterialPurchase(
        material_id=material.id,
        quantity=quantity,
        price_per_unit=price,
        total_cost=total,
        supplier=data.get('supplier', material.supplier),
        purchased_by=user_id,
        purchase_date=data.get('purchase_date', date.today()),
        notes=data.get('notes')
    )
    db.session.add(purchase)
    
    # Update material stock (trigger juga bisa handle ini)
    material.stock_current += quantity
    
    # Record as expense transaction
    transaction = Transaction(
        type='expense',
        category='bahan_baku',
        description=f"Pembelian {material.name} ({quantity} {material.unit})",
        amount=total,
        reference_id=purchase.id,
        reference_type='material_purchase',
        recorded_by=user_id,
        transaction_date=data.get('purchase_date', date.today())
    )
    db.session.add(transaction)
    
    db.session.commit()
    return jsonify({
        "message": f"Pembelian {material.name} berhasil dicatat",
        "purchase": purchase.to_dict()
    }), 201

@purchases_bp.route('', methods=['GET'])
@any_authenticated
def list_purchases():
    claims = get_jwt()
    user_id = get_jwt_identity()
    role = claims.get('role')
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    query = MaterialPurchase.query
    
    # Cashier hanya lihat pembelian sendiri
    if role == 'cashier':
        query = query.filter_by(purchased_by=user_id)
    
    # Filter by date range
    start = request.args.get('start_date')
    end = request.args.get('end_date')
    if start:
        query = query.filter(MaterialPurchase.purchase_date >= start)
    if end:
        query = query.filter(MaterialPurchase.purchase_date <= end)
    
    query = query.order_by(MaterialPurchase.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        "data": [p.to_dict() for p in pagination.items],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_items": pagination.total,
            "total_pages": pagination.pages
        }
    })
```

---

### 7. Sales History & Export (Riwayat Penjualan) — Manager Only

Manager bisa lihat SEMUA riwayat penjualan dan export ke CSV/Excel.

```
GET /api/sales/history
  Query params:
    ?page=1&per_page=20
    &start_date=2025-01-01
    &end_date=2025-01-31
    &search=INV-2025
    &payment_method=cash
    &cashier_id=1
    &sort_by=created_at
    &sort_order=desc
  
  Response: {
    data: [...],
    pagination: { page, per_page, total_items, total_pages },
    summary: { total_revenue, total_hpp, total_profit, total_transactions }
  }

GET /api/sales/:id → Detail satu penjualan + items
GET /api/sales/export?format=csv|excel → Download file
```

```python
# Tambahkan ke app/routes/sales.py

@sales_bp.route('/history', methods=['GET'])
@manager_required
def sales_history():
    """Manager lihat semua riwayat penjualan"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    query = Sale.query
    
    # Filters
    start = request.args.get('start_date')
    end = request.args.get('end_date')
    search = request.args.get('search')
    payment = request.args.get('payment_method')
    cashier = request.args.get('cashier_id', type=int)
    
    if start:
        query = query.filter(Sale.created_at >= start)
    if end:
        query = query.filter(Sale.created_at <= end + ' 23:59:59')
    if search:
        query = query.filter(Sale.invoice_number.ilike(f'%{search}%'))
    if payment:
        query = query.filter_by(payment_method=payment)
    if cashier:
        query = query.filter_by(cashier_id=cashier)
    
    # Sort
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')
    order_col = getattr(Sale, sort_by, Sale.created_at)
    query = query.order_by(order_col.desc() if sort_order == 'desc' else order_col.asc())
    
    # Summary (before pagination)
    from sqlalchemy import func
    summary_query = query.with_entities(
        func.sum(Sale.total_amount).label('revenue'),
        func.sum(Sale.total_hpp).label('hpp'),
        func.sum(Sale.profit).label('profit'),
        func.count(Sale.id).label('count')
    ).first()
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        "data": [s.to_dict_with_items() for s in pagination.items],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_items": pagination.total,
            "total_pages": pagination.pages
        },
        "summary": {
            "total_revenue": float(summary_query.revenue or 0),
            "total_hpp": float(summary_query.hpp or 0),
            "total_profit": float(summary_query.profit or 0),
            "total_transactions": summary_query.count or 0
        }
    })

@sales_bp.route('/<int:sale_id>', methods=['GET'])
@any_authenticated
def get_sale_detail(sale_id):
    sale = Sale.query.get_or_404(sale_id)
    
    # Cashier hanya bisa lihat penjualan sendiri
    claims = get_jwt()
    if claims.get('role') == 'cashier':
        user_id = get_jwt_identity()
        if sale.cashier_id != user_id:
            return jsonify({"error": "Akses ditolak"}), 403
    
    return jsonify(sale.to_dict_with_items())

@sales_bp.route('/export', methods=['GET'])
@manager_required
def export_sales():
    """Export riwayat penjualan ke CSV atau Excel"""
    format_type = request.args.get('format', 'csv')
    
    # Build same query as history (without pagination)
    query = Sale.query
    start = request.args.get('start_date')
    end = request.args.get('end_date')
    if start:
        query = query.filter(Sale.created_at >= start)
    if end:
        query = query.filter(Sale.created_at <= end + ' 23:59:59')
    
    sales = query.order_by(Sale.created_at.desc()).all()
    
    if format_type == 'excel':
        return export_excel(sales)
    else:
        return export_csv(sales)

def export_csv(sales):
    import csv, io
    from flask import Response
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['No', 'Invoice', 'Tanggal', 'Kasir', 'Metode Bayar',
                     'Jumlah Item', 'Subtotal (Rp)', 'HPP (Rp)', 'Profit (Rp)'])
    
    for i, sale in enumerate(sales, 1):
        from app.models.user import User
        cashier = User.query.get(sale.cashier_id)
        writer.writerow([
            i, sale.invoice_number,
            sale.created_at.strftime('%Y-%m-%d %H:%M'),
            cashier.name if cashier else '-',
            sale.payment_method,
            len(sale.items),
            float(sale.total_amount),
            float(sale.total_hpp),
            float(sale.profit)
        ])
    
    response = Response(output.getvalue(), mimetype='text/csv')
    response.headers['Content-Disposition'] = 'attachment; filename=riwayat_penjualan.csv'
    return response

def export_excel(sales):
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, numbers
    from flask import send_file
    import io
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Riwayat Penjualan"
    
    # Header styling
    header_fill = PatternFill(start_color="2E7D32", end_color="2E7D32", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF", size=11)
    
    headers = ['No', 'Invoice', 'Tanggal', 'Kasir', 'Metode Bayar',
               'Jumlah Item', 'Subtotal (Rp)', 'HPP (Rp)', 'Profit (Rp)']
    
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center')
    
    for i, sale in enumerate(sales, 1):
        from app.models.user import User
        cashier = User.query.get(sale.cashier_id)
        row = i + 1
        ws.cell(row=row, column=1, value=i)
        ws.cell(row=row, column=2, value=sale.invoice_number)
        ws.cell(row=row, column=3, value=sale.created_at.strftime('%Y-%m-%d %H:%M'))
        ws.cell(row=row, column=4, value=cashier.name if cashier else '-')
        ws.cell(row=row, column=5, value=sale.payment_method)
        ws.cell(row=row, column=6, value=len(sale.items))
        ws.cell(row=row, column=7, value=float(sale.total_amount))
        ws.cell(row=row, column=8, value=float(sale.total_hpp))
        ws.cell(row=row, column=9, value=float(sale.profit))
    
    # Summary row
    total_row = len(sales) + 2
    ws.cell(row=total_row, column=6, value="TOTAL").font = Font(bold=True)
    ws.cell(row=total_row, column=7, value=sum(float(s.total_amount) for s in sales)).font = Font(bold=True)
    ws.cell(row=total_row, column=8, value=sum(float(s.total_hpp) for s in sales)).font = Font(bold=True)
    ws.cell(row=total_row, column=9, value=sum(float(s.profit) for s in sales)).font = Font(bold=True)
    
    # Auto-fit columns
    for col in ws.columns:
        max_length = max(len(str(cell.value or '')) for cell in col)
        ws.column_dimensions[col[0].column_letter].width = max_length + 4
    
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    
    return send_file(output, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                     as_attachment=True, download_name='riwayat_penjualan.xlsx')
```

---

### 8. Dashboard & Reports — Both Roles (different data)

```
GET /api/dashboard/kpi
  - Manager: full KPI (revenue, HPP, profit, margin, expenses)
  - Cashier: limited KPI (today's sales count, today's revenue)

GET /api/dashboard/revenue-chart
  Query: ?period=daily&start=2025-01-01&end=2025-01-31
  Response: [{ date, revenue, hpp, profit }]

GET /api/dashboard/cost-composition
  Response: [{ name: "Bahan Baku", value: 78 }, ...]

GET /api/dashboard/top-products
  Query: ?limit=5
  Response: [{ name, total_sold, revenue, profit, margin }]

GET /api/dashboard/recent-activity
  Response: [{ type, description, amount, timestamp }]
```

```python
# app/routes/dashboard.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.utils.decorators import any_authenticated, manager_required
from app.models.sale import Sale
from app.models.transaction import Transaction
from app.models.product import Product
from app import db
from sqlalchemy import func
from datetime import date, timedelta

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/kpi', methods=['GET'])
@any_authenticated
def get_kpi():
    claims = get_jwt()
    role = claims.get('role')
    period = request.args.get('period', 'monthly')
    
    # Date range
    if period == 'daily':
        start_date = date.today()
    elif period == 'weekly':
        start_date = date.today() - timedelta(days=7)
    else:
        start_date = date.today().replace(day=1)
    
    sales_query = Sale.query.filter(Sale.created_at >= start_date)
    
    if role == 'cashier':
        # Cashier hanya lihat data sendiri
        user_id = get_jwt_identity()
        sales_query = sales_query.filter_by(cashier_id=user_id)
        
        result = sales_query.with_entities(
            func.count(Sale.id).label('count'),
            func.coalesce(func.sum(Sale.total_amount), 0).label('revenue')
        ).first()
        
        return jsonify({
            "total_transactions": result.count,
            "total_revenue": float(result.revenue),
            "period": period
        })
    
    # Manager: full KPI
    sales_result = sales_query.with_entities(
        func.count(Sale.id).label('count'),
        func.coalesce(func.sum(Sale.total_amount), 0).label('revenue'),
        func.coalesce(func.sum(Sale.total_hpp), 0).label('hpp'),
        func.coalesce(func.sum(Sale.profit), 0).label('profit'),
        func.coalesce(func.avg(Sale.total_amount), 0).label('avg')
    ).first()
    
    expenses = db.session.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.type == 'expense',
        Transaction.transaction_date >= start_date
    ).scalar()
    
    revenue = float(sales_result.revenue)
    hpp = float(sales_result.hpp)
    gross_margin = round(((revenue - hpp) / revenue) * 100, 1) if revenue > 0 else 0
    net_profit = float(sales_result.profit) - float(expenses)
    
    return jsonify({
        "total_revenue": revenue,
        "total_hpp": hpp,
        "gross_margin": gross_margin,
        "total_transactions": sales_result.count,
        "avg_transaction": float(sales_result.avg),
        "total_expenses": float(expenses),
        "net_profit": net_profit,
        "period": period
    })

@dashboard_bp.route('/revenue-chart', methods=['GET'])
@manager_required
def revenue_chart():
    days = request.args.get('days', 30, type=int)
    start_date = date.today() - timedelta(days=days)
    
    results = db.session.query(
        func.date(Sale.created_at).label('date'),
        func.sum(Sale.total_amount).label('revenue'),
        func.sum(Sale.total_hpp).label('hpp'),
        func.sum(Sale.profit).label('profit')
    ).filter(
        Sale.created_at >= start_date
    ).group_by(
        func.date(Sale.created_at)
    ).order_by('date').all()
    
    return jsonify([{
        "date": str(r.date),
        "revenue": float(r.revenue),
        "hpp": float(r.hpp),
        "profit": float(r.profit)
    } for r in results])

@dashboard_bp.route('/cost-composition', methods=['GET'])
@manager_required
def cost_composition():
    """Breakdown HPP: BBB, BTKL, BOP, Operasional"""
    from app.models.product_ingredient import ProductIngredient
    from app.models.btkl_allocation import BTKLAllocation
    
    bbb = db.session.query(func.coalesce(func.sum(ProductIngredient.cost), 0)).scalar()
    btkl = db.session.query(func.coalesce(func.sum(BTKLAllocation.allocated_cost), 0)).scalar()
    
    operational = db.session.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.type == 'expense',
        Transaction.category == 'operasional'
    ).scalar()
    
    total = float(bbb) + float(btkl) + float(operational)
    
    return jsonify([
        {"name": "Bahan Baku (BBB)", "value": round(float(bbb) / total * 100, 1) if total > 0 else 0},
        {"name": "Tenaga Kerja (BTKL)", "value": round(float(btkl) / total * 100, 1) if total > 0 else 0},
        {"name": "Operasional", "value": round(float(operational) / total * 100, 1) if total > 0 else 0}
    ])

@dashboard_bp.route('/top-products', methods=['GET'])
@manager_required
def top_products():
    from app.models.sale_item import SaleItem
    
    limit = request.args.get('limit', 5, type=int)
    
    results = db.session.query(
        SaleItem.product_name,
        func.sum(SaleItem.quantity).label('total_sold'),
        func.sum(SaleItem.subtotal).label('revenue'),
        func.sum((SaleItem.selling_price - SaleItem.hpp_per_unit) * SaleItem.quantity).label('profit')
    ).group_by(SaleItem.product_name).order_by(func.sum(SaleItem.subtotal).desc()).limit(limit).all()
    
    return jsonify([{
        "name": r.product_name,
        "total_sold": r.total_sold,
        "revenue": float(r.revenue),
        "profit": float(r.profit),
        "margin": round(float(r.profit) / float(r.revenue) * 100, 1) if float(r.revenue) > 0 else 0
    } for r in results])
```

---

### 9. Reports / Laporan — Manager Only

```
GET /api/reports/profit-loss
  Query: ?start_date=2025-01-01&end_date=2025-01-31
  Response: {
    period: { start, end },
    revenue: { total, by_product: [...] },
    hpp: { total, bbb, btkl, bop },
    gross_profit,
    expenses: { total, by_category: [...] },
    net_profit
  }

GET /api/reports/export?format=excel
  → Download laporan laba rugi Excel
```

```python
# app/routes/reports.py
from flask import Blueprint, request, jsonify
from app.utils.decorators import manager_required
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.models.transaction import Transaction
from app import db
from sqlalchemy import func
from datetime import date

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@reports_bp.route('/profit-loss', methods=['GET'])
@manager_required
def profit_loss():
    start = request.args.get('start_date', date.today().replace(day=1).isoformat())
    end = request.args.get('end_date', date.today().isoformat())
    
    # Revenue by product
    revenue_by_product = db.session.query(
        SaleItem.product_name,
        func.sum(SaleItem.quantity).label('qty'),
        func.sum(SaleItem.subtotal).label('revenue'),
        func.sum(SaleItem.hpp_per_unit * SaleItem.quantity).label('hpp')
    ).join(Sale).filter(
        Sale.created_at >= start,
        Sale.created_at <= end + ' 23:59:59'
    ).group_by(SaleItem.product_name).all()
    
    total_revenue = sum(float(r.revenue) for r in revenue_by_product)
    total_hpp = sum(float(r.hpp) for r in revenue_by_product)
    gross_profit = total_revenue - total_hpp
    
    # Expenses by category
    expenses_by_cat = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.type == 'expense',
        Transaction.transaction_date >= start,
        Transaction.transaction_date <= end
    ).group_by(Transaction.category).all()
    
    total_expenses = sum(float(e.total) for e in expenses_by_cat)
    net_profit = gross_profit - total_expenses
    
    return jsonify({
        "period": {"start": start, "end": end},
        "revenue": {
            "total": total_revenue,
            "by_product": [{
                "name": r.product_name,
                "quantity": r.qty,
                "revenue": float(r.revenue),
                "hpp": float(r.hpp)
            } for r in revenue_by_product]
        },
        "hpp": {"total": total_hpp},
        "gross_profit": gross_profit,
        "expenses": {
            "total": total_expenses,
            "by_category": [{
                "category": e.category,
                "total": float(e.total)
            } for e in expenses_by_cat]
        },
        "net_profit": net_profit
    })
```

---

### 10. AI Chat (Parsing Transaksi) — Manager Only

```
POST /api/chat
  Body: { message: "jual kopi susu 5 cup" }
  Response: {
    type: "sale" | "expense" | "info" | "unknown",
    parsed: { product, quantity, total },
    message: "...",
    transaction_id: 123
  }
```

```python
# app/services/chat_parser.py
import re
from app.models.product import Product
from app.models.raw_material import RawMaterial

def parse_transaction(message: str):
    """Parse natural language transaction input"""
    msg = message.lower().strip()
    
    # Detect type
    sale_keywords = ['jual', 'penjualan', 'terjual', 'laku', 'sold']
    expense_keywords = ['beli', 'bayar', 'pembelian', 'purchase', 'biaya']
    info_keywords = ['berapa', 'harga', 'stok', 'stock', 'info', 'cek']
    
    tx_type = 'unknown'
    if any(kw in msg for kw in sale_keywords):
        tx_type = 'sale'
    elif any(kw in msg for kw in expense_keywords):
        tx_type = 'expense'
    elif any(kw in msg for kw in info_keywords):
        tx_type = 'info'
    
    # Extract quantity
    qty_match = re.search(r'(\d+)\s*(cup|pcs|porsi|buah|unit|kg|liter|botol)?', msg)
    quantity = int(qty_match.group(1)) if qty_match else 1
    
    # Match product/material
    if tx_type == 'sale' or tx_type == 'info':
        products = Product.query.filter_by(is_active=True).all()
        matched = None
        for p in products:
            if p.name.lower() in msg or any(word in msg for word in p.name.lower().split()):
                matched = p
                break
        
        if matched:
            total = matched.selling_price * quantity
            return {
                "type": tx_type,
                "parsed": {
                    "product_id": matched.id,
                    "product": matched.name,
                    "quantity": quantity,
                    "price": float(matched.selling_price),
                    "total": float(total),
                    "hpp": float(matched.hpp * quantity)
                },
                "message": f"{'Penjualan' if tx_type == 'sale' else 'Info'} {quantity}x {matched.name} = Rp{total:,.0f}"
            }
    
    elif tx_type == 'expense':
        materials = RawMaterial.query.all()
        matched = None
        for m in materials:
            if m.name.lower() in msg or any(word in msg for word in m.name.lower().split()):
                matched = m
                break
        
        if matched:
            # Extract amount
            amount_match = re.search(r'(?:rp\.?|idr)\s*([\d.,]+)', msg)
            amount = float(amount_match.group(1).replace('.', '').replace(',', '')) if amount_match else matched.price_per_unit * quantity
            
            return {
                "type": "expense",
                "parsed": {
                    "material_id": matched.id,
                    "material": matched.name,
                    "quantity": quantity,
                    "amount": amount
                },
                "message": f"Pembelian {quantity} {matched.unit} {matched.name} = Rp{amount:,.0f}"
            }
    
    return {
        "type": "unknown",
        "parsed": None,
        "message": "Maaf, saya tidak bisa memahami perintah tersebut. Coba format: 'jual kopi susu 5 cup' atau 'beli gula 2 kg'"
    }
```

---

### 11. Settings (Pengaturan Bisnis) — Manager Only

```
GET  /api/settings              → Get business settings
PUT  /api/settings              → Update business settings
  Body: { business_name, business_type, address, phone, tax_percentage, currency }
```

---

## 📦 SQLAlchemy Models

```python
# app/models/user.py
from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='cashier')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "email": self.email,
            "role": self.role, "is_active": self.is_active
        }

# app/models/product.py
class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    selling_price = db.Column(db.Numeric(15,2), nullable=False, default=0)
    hpp = db.Column(db.Numeric(15,2), nullable=False, default=0)
    margin_percent = db.Column(db.Numeric(5,2), default=0)
    stock_current = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    ingredients = db.relationship('ProductIngredient', backref='product', lazy=True, cascade='all, delete-orphan')
    btkl_allocations = db.relationship('BTKLAllocation', backref='product', lazy=True, cascade='all, delete-orphan')

# app/models/raw_material.py
class RawMaterial(db.Model):
    __tablename__ = 'raw_materials'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False, default='bahan_baku')
    unit = db.Column(db.String(50), nullable=False)
    price_per_unit = db.Column(db.Numeric(15,2), default=0)
    stock_current = db.Column(db.Numeric(15,2), default=0)
    minimum_stock = db.Column(db.Numeric(15,2), default=0)
    supplier = db.Column(db.String(200))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# app/models/employee.py
class Employee(db.Model):
    __tablename__ = 'employees'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100))
    department = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    wage_type = db.Column(db.String(20), default='daily')
    daily_wage = db.Column(db.Numeric(15,2), default=0)
    monthly_wage = db.Column(db.Numeric(15,2), default=0)
    is_production_labor = db.Column(db.Boolean, default=False)
    join_date = db.Column(db.Date)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    btkl_allocations = db.relationship('BTKLAllocation', backref='employee', lazy=True, cascade='all, delete-orphan')

# app/models/sale.py
class Sale(db.Model):
    __tablename__ = 'sales'
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    cashier_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    payment_method = db.Column(db.String(20), default='cash')
    subtotal = db.Column(db.Numeric(15,2), default=0)
    tax_amount = db.Column(db.Numeric(15,2), default=0)
    discount_amount = db.Column(db.Numeric(15,2), default=0)
    total_amount = db.Column(db.Numeric(15,2), default=0)
    total_hpp = db.Column(db.Numeric(15,2), default=0)
    profit = db.Column(db.Numeric(15,2), default=0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    items = db.relationship('SaleItem', backref='sale', lazy=True, cascade='all, delete-orphan')
    cashier = db.relationship('User', backref='sales')

# app/models/sale_item.py
class SaleItem(db.Model):
    __tablename__ = 'sale_items'
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_name = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    selling_price = db.Column(db.Numeric(15,2), nullable=False)
    hpp_per_unit = db.Column(db.Numeric(15,2), nullable=False)
    subtotal = db.Column(db.Numeric(15,2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# app/models/transaction.py
class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(50), default='lainnya')
    description = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Numeric(15,2), nullable=False)
    reference_id = db.Column(db.Integer)
    reference_type = db.Column(db.String(50))
    recorded_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    transaction_date = db.Column(db.Date, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# app/models/btkl_allocation.py
class BTKLAllocation(db.Model):
    __tablename__ = 'btkl_allocations'
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    percentage = db.Column(db.Numeric(5,2), nullable=False)
    allocated_cost = db.Column(db.Numeric(15,2), default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('employee_id', 'product_id'),)

# app/models/material_purchase.py
class MaterialPurchase(db.Model):
    __tablename__ = 'material_purchases'
    id = db.Column(db.Integer, primary_key=True)
    material_id = db.Column(db.Integer, db.ForeignKey('raw_materials.id'), nullable=False)
    quantity = db.Column(db.Numeric(15,2), nullable=False)
    price_per_unit = db.Column(db.Numeric(15,2), nullable=False)
    total_cost = db.Column(db.Numeric(15,2), nullable=False)
    supplier = db.Column(db.String(200))
    purchased_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    purchase_date = db.Column(db.Date, default=date.today)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    material = db.relationship('RawMaterial', backref='purchases')
    buyer = db.relationship('User', backref='purchases')
```

---

## 📁 Struktur Folder Backend

```
teratur-backend/
├── app/
│   ├── __init__.py              # Flask app factory + register blueprints
│   ├── config.py                # DB URI, JWT secret, CORS origins
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── product_ingredient.py
│   │   ├── raw_material.py
│   │   ├── employee.py
│   │   ├── btkl_allocation.py
│   │   ├── sale.py
│   │   ├── sale_item.py
│   │   ├── transaction.py
│   │   ├── material_purchase.py
│   │   ├── daily_summary.py
│   │   └── business_settings.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py              # register, login, me, change-password
│   │   ├── products.py          # CRUD + ingredients (manager only)
│   │   ├── materials.py         # CRUD bahan baku (manager only)
│   │   ├── employees.py         # CRUD karyawan (manager only)
│   │   ├── btkl.py              # Alokasi BTKL (manager only)
│   │   ├── sales.py             # POS (cashier), history+export (manager)
│   │   ├── purchases.py         # Pembelian bahan baku (cashier+manager)
│   │   ├── dashboard.py         # KPI + charts (both, filtered by role)
│   │   ├── reports.py           # Profit/loss (manager only)
│   │   ├── chat.py              # AI parser (manager only)
│   │   └── settings.py          # Business settings (manager only)
│   ├── services/
│   │   ├── hpp_calculator.py    # HPP = BBB + BTKL + BOP
│   │   ├── export_service.py    # CSV + Excel generation
│   │   └── chat_parser.py       # NLP transaction parser
│   └── utils/
│       ├── decorators.py        # role_required, manager_required, cashier_required
│       └── helpers.py           # formatCurrency, generate_invoice_number
├── migrations/                  # Flask-Migrate (alembic)
├── requirements.txt
├── run.py                       # Entry point
├── .env                         # DB_URI, JWT_SECRET, CORS_ORIGINS
└── .env.example
```

---

## 🔗 App Factory Pattern

```python
# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.materials import materials_bp
    from app.routes.employees import employees_bp
    from app.routes.btkl import btkl_bp
    from app.routes.sales import sales_bp
    from app.routes.purchases import purchases_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.reports import reports_bp
    from app.routes.chat import chat_bp
    from app.routes.settings import settings_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(materials_bp)
    app.register_blueprint(employees_bp)
    app.register_blueprint(btkl_bp)
    app.register_blueprint(sales_bp)
    app.register_blueprint(purchases_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(settings_bp)
    
    return app

# app/config.py
import os
from datetime import timedelta

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://user:pass@localhost:5432/teratur')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-this')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')

# run.py
from app import create_app
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

## 🔗 Frontend Integration (React)

```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('teratur_token');

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    localStorage.removeItem('teratur_token');
    localStorage.removeItem('teratur_auth');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (res.status === 403) {
    throw new Error('Akses ditolak');
  }
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Terjadi kesalahan');
  }
  return res.json();
};

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(res);
  },

  post: async (path: string, data: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  put: async (path: string, data: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  delete: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(res);
  },

  download: async (path: string, filename: string) => {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Download gagal');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
```

---

## ⚡ Prioritas Development

| # | Modul | Prioritas | Role Access |
|---|-------|-----------|-------------|
| 1 | Auth (register/login/JWT/change-password) | 🔴 Tinggi | All |
| 2 | Products + Ingredients CRUD | 🔴 Tinggi | Manager |
| 3 | Raw Materials CRUD | 🔴 Tinggi | Manager |
| 4 | POS / Sales Transaction | 🔴 Tinggi | Cashier |
| 5 | Material Purchases | 🔴 Tinggi | Cashier + Manager |
| 6 | Sales History + Export | 🔴 Tinggi | Manager |
| 7 | Dashboard KPI | 🟡 Sedang | Both (filtered) |
| 8 | Employees CRUD | 🟡 Sedang | Manager |
| 9 | BTKL Allocation | 🟡 Sedang | Manager |
| 10 | Reports (Profit/Loss) | 🟡 Sedang | Manager |
| 11 | AI Chat Parser | 🟢 Rendah | Manager |
| 12 | Settings | 🟢 Rendah | Manager |

---

## 🚀 Quick Start

```bash
# 1. Clone & setup
cd teratur-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install
pip install -r requirements.txt

# 3. Environment
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET

# 4. Database
createdb teratur  # PostgreSQL
flask db init
flask db migrate -m "initial"
flask db upgrade

# 5. Seed data (optional)
psql teratur < ../docs/database_schema.sql  # Jalankan bagian INSERT saja

# 6. Run
flask run --port 5000
```

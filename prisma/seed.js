"use strict";
/**
 * Seed script — creates the initial AdminUser.
 * Run once: npx prisma db seed
 * OR: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-require-imports
var PrismaClient = require('@prisma/client').PrismaClient;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var email, password, name, existingAdmin, passwordHash, user, categories, _i, categories_1, cat;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    email = (_a = process.env.SEED_ADMIN_EMAIL) !== null && _a !== void 0 ? _a : 'admin@vintage.com';
                    password = (_b = process.env.SEED_ADMIN_PASSWORD) !== null && _b !== void 0 ? _b : 'ChangeMe123!';
                    name = (_c = process.env.SEED_ADMIN_NAME) !== null && _c !== void 0 ? _c : 'Admin';
                    return [4 /*yield*/, prisma.adminUser.findUnique({ where: { email: email } })];
                case 1:
                    existingAdmin = _d.sent();
                    if (!!existingAdmin) return [3 /*break*/, 4];
                    return [4 /*yield*/, bcryptjs_1.default.hash(password, 12)];
                case 2:
                    passwordHash = _d.sent();
                    return [4 /*yield*/, prisma.adminUser.create({
                            data: { email: email, name: name, passwordHash: passwordHash },
                        })];
                case 3:
                    user = _d.sent();
                    console.log("\u2705 Admin created: ".concat(user.email));
                    console.log("   Password: ".concat(password));
                    console.log("   \u26A0\uFE0F  Change this password after first login!");
                    return [3 /*break*/, 5];
                case 4:
                    console.log("Admin user already exists: ".concat(email));
                    _d.label = 5;
                case 5:
                    categories = [
                        { slug: 'denim', name: 'Denim & Workwear', currency: 'USD', isActive: true, sortOrder: 1 },
                        { slug: 'sportswear', name: 'Retro Sports & Streetwear', currency: 'USD', isActive: true, sortOrder: 2 },
                        { slug: 'designer', name: 'Archive Designer & Luxury', currency: 'USD', isActive: true, sortOrder: 3 },
                        { slug: 'heritage-textiles', name: 'Silk Sarees & Heritage Weaves', currency: 'INR', priceRangeMin: 500, priceRangeMax: 150000, isActive: true, sortOrder: 4 },
                        { slug: 'outerwear', name: 'Jackets & Outerwear', currency: 'USD', isActive: true, sortOrder: 5 },
                        { slug: 'accessories', name: 'Bags, Scarves & Accessories', currency: 'USD', isActive: true, sortOrder: 6 },
                    ];
                    _i = 0, categories_1 = categories;
                    _d.label = 6;
                case 6:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 9];
                    cat = categories_1[_i];
                    return [4 /*yield*/, prisma.category.upsert({
                            where: { slug: cat.slug },
                            update: cat,
                            create: cat,
                        })];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    console.log("\u2705 Seeded ".concat(categories.length, " core categories."));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(console.error)
    .finally(function () { return prisma.$disconnect(); });

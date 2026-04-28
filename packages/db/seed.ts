import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    ["lead:submit", "Submit lead"],
    ["banker_profile:manage_own", "Manage own banker profile"],
    ["lead:view_assigned", "View assigned leads"],
    ["content:manage", "Manage content"],
    ["rates:manage", "Manage rates"],
    ["banker:verify", "Verify bankers"],
    ["settings:manage", "Manage settings"]
  ] as const;

  for (const [code, name] of permissions) {
    await prisma.permission.upsert({
      where: { code },
      update: { name },
      create: { code, name }
    });
  }

  const superAdminRole = await prisma.role.upsert({
    where: { code: "super_admin" },
    update: { name: "Super admin" },
    create: { code: "super_admin", name: "Super admin" }
  });

  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id
      }
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@bankng.local" },
    update: {},
    create: {
      email: "admin@bankng.local",
      status: "active",
      profile: {
        create: {
          fullName: "Bankng Admin"
        }
      }
    }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: superAdminRole.id
      }
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: superAdminRole.id
    }
  });

  const bank = await prisma.bank.upsert({
    where: { slug: "demo-bank" },
    update: {},
    create: {
      slug: "demo-bank",
      name: "Demo Bank",
      shortName: "DEMO",
      description: "Seed bank for M1 foundation."
    }
  });

  const category = await prisma.productCategory.upsert({
    where: { slug: "gui-tiet-kiem" },
    update: {},
    create: {
      slug: "gui-tiet-kiem",
      name: "Gui tiet kiem",
      description: "Seed category for deposit comparison."
    }
  });

  const product = await prisma.financialProduct.upsert({
    where: { slug: "demo-bank-tiet-kiem-online" },
    update: {},
    create: {
      bankId: bank.id,
      categoryId: category.id,
      slug: "demo-bank-tiet-kiem-online",
      name: "Tiet kiem online Demo Bank",
      shortDescription: "Seed product for compare foundation.",
      status: "active",
      isPublic: true
    }
  });

  const variant = await prisma.productVariant.upsert({
    where: { slug: "demo-bank-tiet-kiem-online-6-thang" },
    update: {},
    create: {
      productId: product.id,
      slug: "demo-bank-tiet-kiem-online-6-thang",
      variantName: "Ky han 6 thang",
      minTermMonth: 6,
      maxTermMonth: 6,
      status: "active"
    }
  });

  const source = await prisma.rateSource.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      sourceType: "ops_verified",
      sourceName: "Seed data",
      reliabilityScore: 50
    }
  });

  const effectiveFrom = new Date("2026-01-01T00:00:00.000Z");

  await prisma.interestRateSnapshot.upsert({
    where: {
      unique_rate_snapshot: {
        productVariantId: variant.id,
        rateType: "deposit",
        termValue: 6,
        termUnit: "month",
        effectiveFrom,
        sourceId: source.id
      }
    },
    update: {
      rateValue: 6,
      status: "verified",
      createdById: admin.id
    },
    create: {
      productVariantId: variant.id,
      rateType: "deposit",
      termValue: 6,
      termUnit: "month",
      rateValue: 6,
      effectiveFrom,
      sourceId: source.id,
      status: "verified",
      createdById: admin.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

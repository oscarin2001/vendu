import { NextRequest, NextResponse } from "next/server";
import { getCompanyByTenant } from "@/services/admin/company/services/company-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;
    const company = await getCompanyByTenant(tenantId);

    return NextResponse.json({
      name: company.name,
      // Add other fields as needed
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }
}

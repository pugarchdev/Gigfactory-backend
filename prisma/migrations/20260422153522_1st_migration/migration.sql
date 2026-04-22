-- CreateEnum
CREATE TYPE "LODLevel" AS ENUM ('LOD_300', 'LOD_350', 'LOD_400', 'LOD_500');

-- CreateEnum
CREATE TYPE "Specialization" AS ENUM ('STRUCTURAL', 'MEP', 'ARCHITECTURAL', 'FIRE_LIFE_SAFETY');

-- CreateEnum
CREATE TYPE "MeasurementStandard" AS ENUM ('IS_1200', 'RICS', 'NRM2', 'SMM7');

-- CreateEnum
CREATE TYPE "HardwareCapacity" AS ENUM ('RENDER_FARM', 'HIGH_END_GPU', 'CLOUD_RENDERING', 'STANDARD_WORKSTATION');

-- CreateEnum
CREATE TYPE "SoftwareType" AS ENUM ('REVIT', 'AUTOCAD', 'NAVISWORKS', 'TEKLA', 'CIVIL_3D');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('LASER_SCANNER', 'TOTAL_STATION', 'DRONE');

-- CreateEnum
CREATE TYPE "RenderingEngine" AS ENUM ('VRAY', 'CORONA', 'LUMION', 'UNREAL_ENGINE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ServiceRadius" AS ENUM ('CITY', 'STATE', 'NATIONWIDE', 'PAN_INDIA_EXPORT');

-- CreateEnum
CREATE TYPE "CommercialBasis" AS ENUM ('HOURLY', 'PER_SQFT', 'PER_SHEET', 'LUMP_SUM');

-- CreateEnum
CREATE TYPE "LeadTime" AS ENUM ('IMMEDIATE', 'ONE_WEEK', 'TWO_WEEKS', 'FOUR_WEEKS');

-- CreateEnum
CREATE TYPE "ServiceRadiusFreelancer" AS ENUM ('CITY', 'STATE', 'NATIONWIDE');

-- CreateEnum
CREATE TYPE "CommercialBasisFreelancer" AS ENUM ('HOURLY', 'PER_SQFT', 'PER_SHEET', 'FIXED_PROJECT');

-- CreateEnum
CREATE TYPE "LeadTimeFreelancer" AS ENUM ('IMMEDIATE', 'ONE_WEEK', 'TWO_WEEKS');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('FULL_TIME', 'PART_TIME', 'PROJECT_BASIS');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "status" TEXT NOT NULL DEFAULT 'ongoing',
    "description" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "images" TEXT[],
    "area" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "image" TEXT,
    "features" TEXT NOT NULL,
    "pdfLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expertise" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "points" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Expertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeVideo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "youtubeLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "YoutubeVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyApplication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorizedPerson" TEXT,
    "designation" TEXT,
    "linkedinUrl" TEXT,
    "headquarters" TEXT,
    "website" TEXT,
    "companyName" TEXT,
    "gstNumber" TEXT,
    "cin" TEXT,
    "pan" TEXT,
    "providesBIM" BOOLEAN NOT NULL DEFAULT false,
    "providesAsBuiltAudit" BOOLEAN NOT NULL DEFAULT false,
    "providesPeerReview" BOOLEAN NOT NULL DEFAULT false,
    "providesBOQ" BOOLEAN NOT NULL DEFAULT false,
    "provides3DRendering" BOOLEAN NOT NULL DEFAULT false,
    "bimSoftwares" TEXT,
    "lodCapability" TEXT,
    "cdeExperience" TEXT,
    "equipmentOwned" TEXT,
    "serviceRadius" TEXT,
    "totalExperience" TEXT,
    "specialization" TEXT,
    "measurementStandard" TEXT,
    "estimationSoftware" TEXT,
    "renderingEngines" TEXT,
    "hardwareCapacity" TEXT,
    "animationCapability" BOOLEAN,
    "portfolioUrl" TEXT,
    "portfolioPdfUrl" TEXT,
    "commercialBasis" TEXT,
    "baseRate" DOUBLE PRECISION,
    "leadTime" TEXT,
    "teamSize" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "signature" TEXT,
    "declarationDate" TIMESTAMP(3),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AgencyApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelancerApplication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT,
    "designation" TEXT,
    "linkedinUrl" TEXT,
    "location" TEXT,
    "legalName" TEXT,
    "pan" TEXT,
    "providesBIM" BOOLEAN NOT NULL DEFAULT false,
    "providesAsBuiltAudit" BOOLEAN NOT NULL DEFAULT false,
    "providesPeerReview" BOOLEAN NOT NULL DEFAULT false,
    "providesBOQ" BOOLEAN NOT NULL DEFAULT false,
    "provides3DRendering" BOOLEAN NOT NULL DEFAULT false,
    "bimSoftwares" TEXT,
    "lodCapability" TEXT,
    "cdeExperience" TEXT,
    "equipmentOwned" TEXT,
    "serviceRadius" TEXT,
    "totalExperience" TEXT,
    "specialization" TEXT,
    "measurementStandard" TEXT,
    "estimationSoftware" TEXT,
    "renderingEngines" TEXT,
    "hardwareCapacity" TEXT,
    "animationCapability" BOOLEAN,
    "portfolioUrl" TEXT,
    "portfolioPdfUrl" TEXT,
    "commercialBasis" TEXT,
    "baseRate" DOUBLE PRECISION,
    "leadTime" TEXT,
    "availability" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "signature" TEXT,
    "declarationDate" TIMESTAMP(3),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FreelancerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GigExpertFeedback" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expertType" TEXT,
    "expertTypeOther" TEXT,
    "experience" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "location" TEXT,
    "workGeography" TEXT,
    "teamSize" TEXT,
    "teamComposition" TEXT,
    "gigExpertTypes" TEXT[],
    "gigExpertTypeOther" TEXT,
    "designOrBuild" TEXT,
    "projectTypes" TEXT[],
    "projectTypeOther" TEXT,
    "keyWorkAreas" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GigExpertFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "companyName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

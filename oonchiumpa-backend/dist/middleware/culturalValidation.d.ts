import { Request, Response, NextFunction } from 'express';
interface CulturalValidationRequest extends Request {
    culturalValidation?: {
        requiresConsultation: boolean;
        consultationStatus?: string;
        advisorRecommendations?: string[];
        restrictions?: string[];
    };
}
/**
 * Middleware to check if content requires cultural consultation
 * and validate cultural appropriateness before publishing
 */
export declare const culturalValidationMiddleware: (req: CulturalValidationRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
/**
 * Helper function to automatically create consultation request
 */
export declare const requestCulturalConsultation: (contentType: string, contentId: string, purpose: string, requestedById: string, priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT") => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.ConsultationStatus;
    contentType: string;
    contentId: string;
    purpose: string;
    priority: import(".prisma/client").$Enums.ConsultationPriority;
    scheduledAt: Date | null;
    completedAt: Date | null;
    notes: string | null;
    recommendations: string | null;
    culturalSensitivityRating: number | null;
    approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    followUpRequired: boolean;
    requestedById: string;
    advisorId: string;
}>;
export default culturalValidationMiddleware;
//# sourceMappingURL=culturalValidation.d.ts.map
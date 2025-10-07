/**
 * Cultural Content Sensitivity Validator
 * Validates content against Aboriginal cultural protocols and sensitivity guidelines
 */

import { 
  CulturalValidationRule, 
  CulturalValidationResult, 
  CulturalSensitivity,
  ContentValidationContext,
  CulturalViolation,
  CulturalWarning
} from '../types';

export class ContentSensitivityValidator {
  private rules: CulturalValidationRule[] = [];
  private sacredKeywords: string[] = [
    'sacred site',
    'ceremony',
    'initiation',
    'men\'s business',
    'women\'s business',
    'sorry business',
    'dreaming',
    'songlines'
  ];

  private sensitiveTerms: string[] = [
    'traditional owner',
    'elder',
    'ancestor',
    'burial ground',
    'cultural site',
    'traditional knowledge',
    'healing practices'
  ];

  constructor() {
    this.initializeRules();
  }

  private initializeRules(): void {
    this.rules = [
      {
        id: 'sacred-content-check',
        name: 'Sacred Content Detection',
        description: 'Detects potentially sacred content that requires special handling',
        severity: 'error',
        category: 'ceremonial',
        validator: this.validateSacredContent.bind(this)
      },
      {
        id: 'gender-specific-content',
        name: 'Gender-Specific Content',
        description: 'Identifies men\'s or women\'s business that requires appropriate access controls',
        severity: 'warning',
        category: 'contextual',
        validator: this.validateGenderSpecificContent.bind(this)
      },
      {
        id: 'elder-approval-required',
        name: 'Elder Approval Required',
        description: 'Content that must be reviewed by community elders',
        severity: 'warning',
        category: 'textual',
        validator: this.validateElderApprovalRequired.bind(this)
      },
      {
        id: 'cultural-imagery-check',
        name: 'Cultural Imagery Validation',
        description: 'Validates appropriate use of Aboriginal symbols and imagery',
        severity: 'error',
        category: 'visual',
        validator: this.validateCulturalImagery.bind(this)
      },
      {
        id: 'language-respectfulness',
        name: 'Language Respectfulness',
        description: 'Ensures respectful language and terminology',
        severity: 'warning',
        category: 'textual',
        validator: this.validateLanguageRespectfulness.bind(this)
      }
    ];
  }

  public validate(content: any, context: ContentValidationContext): CulturalValidationResult {
    const violations: CulturalViolation[] = [];
    const warnings: CulturalWarning[] = [];
    const suggestions: string[] = [];

    // Run all validation rules
    for (const rule of this.rules) {
      try {
        const result = rule.validator(content);
        violations.push(...result.violations);
        warnings.push(...result.warnings);
        suggestions.push(...result.suggestions);
      } catch (error) {
        console.error(`Error in validation rule ${rule.id}:`, error);
        warnings.push({
          message: `Validation rule ${rule.name} failed to execute`,
          category: 'system',
          requiresReview: true
        });
      }
    }

    // Add context-specific validations
    this.addContextualValidations(content, context, violations, warnings, suggestions);

    return {
      valid: violations.filter(v => v.severity === 'error').length === 0,
      violations,
      warnings,
      suggestions
    };
  }

  private validateSacredContent(content: any): CulturalValidationResult {
    const violations: CulturalViolation[] = [];
    const warnings: CulturalWarning[] = [];
    const suggestions: string[] = [];

    const textContent = this.extractTextContent(content);
    
    for (const keyword of this.sacredKeywords) {
      if (textContent.toLowerCase().includes(keyword.toLowerCase())) {
        violations.push({
          ruleId: 'sacred-content-check',
          message: `Content contains potentially sacred term: "${keyword}". This requires elder approval and may need restricted access.`,
          severity: 'error',
          location: `Text containing "${keyword}"`,
          suggestedFix: 'Remove sensitive content or mark as sacred with appropriate access restrictions'
        });
      }
    }

    if (violations.length > 0) {
      suggestions.push('Consider marking this content as "sacred" or "restricted" in the cultural metadata');
      suggestions.push('Ensure appropriate elder approval process is followed');
      suggestions.push('Add access restrictions to prevent unauthorized viewing');
    }

    return { valid: violations.length === 0, violations, warnings, suggestions };
  }

  private validateGenderSpecificContent(content: any): CulturalValidationResult {
    const violations: CulturalViolation[] = [];
    const warnings: CulturalWarning[] = [];
    const suggestions: string[] = [];

    const textContent = this.extractTextContent(content);
    const genderSpecificTerms = ['men\'s business', 'women\'s business', 'gender-specific'];

    for (const term of genderSpecificTerms) {
      if (textContent.toLowerCase().includes(term.toLowerCase())) {
        warnings.push({
          message: `Content may contain gender-specific cultural information: "${term}". Ensure appropriate access controls are in place.`,
          category: 'gender-specific',
          requiresReview: true
        });

        suggestions.push('Consider adding gender-specific access restrictions');
        suggestions.push('Ensure content is reviewed by appropriate cultural advisors');
      }
    }

    return { valid: true, violations, warnings, suggestions };
  }

  private validateElderApprovalRequired(content: any): CulturalValidationResult {
    const violations: CulturalViolation[] = [];
    const warnings: CulturalWarning[] = [];
    const suggestions: string[] = [];

    const textContent = this.extractTextContent(content);
    
    for (const term of this.sensitiveTerms) {
      if (textContent.toLowerCase().includes(term.toLowerCase())) {
        warnings.push({
          message: `Content references "${term}" which typically requires elder review and approval.`,
          category: 'elder-approval',
          requiresReview: true
        });
      }
    }

    if (warnings.length > 0) {
      suggestions.push('Submit content for elder review before publication');
      suggestions.push('Consider adding cultural context or disclaimers');
      suggestions.push('Verify accuracy of cultural information with community members');
    }

    return { valid: true, violations, warnings, suggestions };
  }

  private validateCulturalImagery(content: any): CulturalValidationResult {
    const violations: CulturalViolation[] = [];
    const warnings: CulturalWarning[] = [];
    const suggestions: string[] = [];

    // Check for media content
    if (content.media && Array.isArray(content.media)) {
      for (const mediaItem of content.media) {
        if (mediaItem.type === 'image') {
          // Check for inappropriate use of cultural symbols
          if (mediaItem.alt && this.containsCulturalSymbols(mediaItem.alt)) {
            warnings.push({
              message: `Image may contain cultural symbols or sacred imagery: "${mediaItem.alt}". Requires cultural review.`,
              category: 'visual',
              requiresReview: true
            });
          }

          // Check cultural sensitivity metadata
          if (mediaItem.cultural && mediaItem.cultural.sensitivity === 'public' && 
              this.containsSacredKeywords(mediaItem.alt || mediaItem.caption || '')) {
            violations.push({
              ruleId: 'cultural-imagery-check',
              message: 'Image marked as public but contains potentially sacred content',
              severity: 'error',
              location: `Media item: ${mediaItem.alt || 'Untitled image'}`,
              suggestedFix: 'Review cultural sensitivity level and add appropriate restrictions'
            });
          }
        }
      }
    }

    if (warnings.length > 0 || violations.length > 0) {
      suggestions.push('Have cultural imagery reviewed by community elders');
      suggestions.push('Ensure proper permissions for use of cultural symbols');
      suggestions.push('Add appropriate cultural context and attribution');
    }

    return { valid: violations.length === 0, violations, warnings, suggestions };
  }

  private validateLanguageRespectfulness(content: any): CulturalValidationResult {
    const violations: CulturalViolation[] = [];
    const warnings: CulturalWarning[] = [];
    const suggestions: string[] = [];

    const textContent = this.extractTextContent(content);
    
    // Check for potentially problematic language
    const problematicTerms = [
      { term: 'aborigine', preferred: 'Aboriginal person' },
      { term: 'native', preferred: 'Aboriginal' },
      { term: 'primitive', preferred: 'traditional' },
      { term: 'stone age', preferred: 'traditional lifestyle' }
    ];

    for (const { term, preferred } of problematicTerms) {
      if (textContent.toLowerCase().includes(term.toLowerCase())) {
        warnings.push({
          message: `Consider using more respectful terminology. "${term}" could be replaced with "${preferred}".`,
          category: 'language',
          requiresReview: false
        });

        suggestions.push(`Replace "${term}" with "${preferred}" for more respectful language`);
      }
    }

    return { valid: true, violations, warnings, suggestions };
  }

  private addContextualValidations(
    content: any, 
    context: ContentValidationContext, 
    violations: CulturalViolation[], 
    warnings: CulturalWarning[], 
    suggestions: string[]
  ): void {
    // Check if content about specific locations requires local community approval
    if (context.location && context.intendedAudience === 'public') {
      warnings.push({
        message: `Content references specific location "${context.location.name}" for public audience. Consider local community consultation.`,
        category: 'location-specific',
        requiresReview: true
      });
      
      suggestions.push('Consult with local traditional owners about location-specific content');
    }

    // Check if author has appropriate cultural authority
    if (context.author && !context.author.community && this.containsSacredKeywords(this.extractTextContent(content))) {
      warnings.push({
        message: 'Author community affiliation not specified for culturally sensitive content.',
        category: 'authority',
        requiresReview: true
      });

      suggestions.push('Verify author has appropriate cultural authority to share this content');
    }
  }

  private extractTextContent(content: any): string {
    let text = '';
    
    if (typeof content === 'string') {
      return content;
    }

    if (content.title) text += content.title + ' ';
    if (content.content?.text) text += content.content.text + ' ';
    if (content.content?.summary) text += content.content.summary + ' ';
    
    // Extract text from content blocks
    if (content.content?.blocks && Array.isArray(content.content.blocks)) {
      for (const block of content.content.blocks) {
        if (block.type === 'text' && block.content?.text) {
          text += block.content.text + ' ';
        }
      }
    }

    return text;
  }

  private containsCulturalSymbols(text: string): boolean {
    const culturalSymbols = ['dot painting', 'dreamtime', 'rainbow serpent', 'boomerang', 'didgeridoo'];
    return culturalSymbols.some(symbol => text.toLowerCase().includes(symbol.toLowerCase()));
  }

  private containsSacredKeywords(text: string): boolean {
    return this.sacredKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  }

  public getSensitivityRecommendation(content: any, context: ContentValidationContext): CulturalSensitivity {
    const validationResult = this.validate(content, context);
    
    // Check for sacred content
    if (validationResult.violations.some(v => v.ruleId === 'sacred-content-check')) {
      return CulturalSensitivity.SACRED;
    }

    // Check for sensitive content
    if (validationResult.warnings.some(w => w.category === 'gender-specific' || w.category === 'elder-approval')) {
      return CulturalSensitivity.SENSITIVE;
    }

    // Check for community-specific content
    if (context.location || validationResult.warnings.some(w => w.category === 'location-specific')) {
      return CulturalSensitivity.COMMUNITY;
    }

    return CulturalSensitivity.PUBLIC;
  }
}
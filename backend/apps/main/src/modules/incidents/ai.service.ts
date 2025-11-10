import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIRecommendation {
  action: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  reasoning?: string;
}

export interface AIAnalysis {
  summary: string;
  recommendations: AIRecommendation[];
  risk_assessment: string;
  mitre_techniques: Array<{
    tactic: string;
    technique: string;
    id: string;
  }>;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;
  private isEnabled: boolean = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    
    if (apiKey && apiKey !== 'your-gemini-api-key-here') {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        this.isEnabled = true;
        this.logger.log('✓ Google Gemini AI initialized successfully');
      } catch (error) {
        this.logger.warn('Failed to initialize Gemini AI:', error.message);
        this.isEnabled = false;
      }
    } else {
      this.logger.warn('Gemini API key not configured - AI features disabled');
      this.isEnabled = false;
    }
  }

  /**
   * Generate AI-powered analysis for a security threat/incident
   */
  async analyzeSecurityThreat(params: {
    indicator: string;
    type: string;
    severity: string;
    confidence: number;
    description?: string;
    intelligence?: any[];
    siteName?: string;
  }): Promise<AIAnalysis> {
    // If AI not enabled, return fallback
    if (!this.isEnabled) {
      return this.getFallbackAnalysis(params);
    }

    try {
      const prompt = this.buildSecurityAnalysisPrompt(params);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse AI response
      const analysis = this.parseAIResponse(text, params);
      
      return analysis;

    } catch (error) {
      this.logger.error('AI analysis failed:', error.message);
      return this.getFallbackAnalysis(params);
    }
  }

  /**
   * Build detailed prompt for security analysis
   */
  private buildSecurityAnalysisPrompt(params: any): string {
    return `You are a cybersecurity expert analyzing a security threat. Provide a detailed analysis in JSON format.

**Threat Information:**
- Indicator: ${params.indicator}
- Type: ${params.type}
- Severity: ${params.severity}
- Confidence: ${params.confidence}%
- Description: ${params.description || 'N/A'}
- Site: ${params.siteName || 'Unknown'}

**Intelligence Data:**
${JSON.stringify(params.intelligence || [], null, 2)}

**Required Output Format (JSON only, no markdown):**
{
  "summary": "Brief 2-3 sentence summary of the threat and its implications",
  "risk_assessment": "Detailed risk assessment explaining the potential impact",
  "recommendations": [
    {
      "action": "Action title",
      "priority": "critical|high|medium|low",
      "description": "Detailed description of what to do",
      "reasoning": "Why this action is recommended"
    }
  ],
  "mitre_techniques": [
    {
      "tactic": "MITRE ATT&CK tactic",
      "technique": "Technique name",
      "id": "Technique ID (e.g., T1078)"
    }
  ]
}

Provide actionable, specific recommendations based on the threat type and severity. Focus on immediate response, investigation steps, and preventive measures.`;
  }

  /**
   * Parse AI response text into structured format
   */
  private parseAIResponse(text: string, params: any): AIAnalysis {
    try {
      // Remove markdown code blocks if present
      const jsonText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(jsonText);

      return {
        summary: parsed.summary || this.getDefaultSummary(params),
        recommendations: (parsed.recommendations || []).slice(0, 5), // Limit to 5
        risk_assessment: parsed.risk_assessment || 'Moderate risk detected',
        mitre_techniques: (parsed.mitre_techniques || []).slice(0, 3), // Limit to 3
      };
    } catch (error) {
      this.logger.warn('Failed to parse AI response, using fallback');
      return this.getFallbackAnalysis(params);
    }
  }

  /**
   * Fallback analysis when AI is unavailable
   */
  private getFallbackAnalysis(params: any): AIAnalysis {
    const isIP = params.type === 'ip';
    const isCritical = params.severity === 'critical' || params.severity === 'high';

    return {
      summary: this.getDefaultSummary(params),
      risk_assessment: isCritical 
        ? 'High risk threat detected. Immediate action recommended to prevent potential security breach.'
        : 'Moderate risk detected. Monitor closely and implement recommended security measures.',
      recommendations: this.getDefaultRecommendations(params),
      mitre_techniques: this.getDefaultMITRE(params),
    };
  }

  private getDefaultSummary(params: any): string {
    return `${params.severity.toUpperCase()} severity ${params.type} threat detected from ${params.indicator}. Confidence level: ${params.confidence}%. Immediate investigation and response recommended.`;
  }

  private getDefaultRecommendations(params: any): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const isIP = params.type === 'ip';

    if (isIP) {
      recommendations.push({
        action: 'Block IP Address',
        priority: params.severity === 'critical' ? 'critical' : 'high',
        description: `Immediately block ${params.indicator} at firewall level to prevent further malicious activity`,
        reasoning: 'Blocking the source IP prevents continued attack attempts',
      });
    }

    recommendations.push(
      {
        action: 'Review Security Logs',
        priority: 'high',
        description: 'Analyze authentication logs and system access logs for the past 24-48 hours',
        reasoning: 'Identify if any successful breaches occurred',
      },
      {
        action: 'Enable Enhanced Monitoring',
        priority: 'medium',
        description: 'Increase monitoring sensitivity for similar threat patterns',
        reasoning: 'Early detection of related threats',
      },
      {
        action: 'Update Security Rules',
        priority: 'medium',
        description: 'Update IDS/IPS rules to detect similar attack patterns',
        reasoning: 'Prevent future attacks using similar techniques',
      }
    );

    return recommendations;
  }

  private getDefaultMITRE(params: any): any[] {
    const techniques = [];

    if (params.type === 'ip' && params.description?.includes('brute')) {
      techniques.push(
        {
          tactic: 'Initial Access',
          technique: 'Valid Accounts',
          id: 'T1078',
        },
        {
          tactic: 'Credential Access',
          technique: 'Brute Force',
          id: 'T1110',
        }
      );
    }

    return techniques;
  }
}

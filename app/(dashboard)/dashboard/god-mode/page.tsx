'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Target,
  Zap,
  Shield,
  Activity,
  CheckCircle2,
  Circle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Brain,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { GodModePlan, AgentTask, ActivityLog } from '@/lib/god-mode/agent'

export default function GodModePage() {
  const [plan, setPlan] = useState<GodModePlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])

  const handleGeneratePlan = async () => {
    setIsGenerating(true)
    
    // Simulate plan generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const mockPlan: GodModePlan = {
      id: 'plan-1',
      title: 'Traffic Growth Plan',
      summary: 'Comprehensive growth strategy using SEO-first content strategy with high-volume keyword targeting. Includes 4 key tactics executed across research, content creation, SEO optimization, publishing, and distribution phases.',
      goals: [
        {
          type: 'traffic',
          target: '10,000 monthly visitors',
          timeframe: '3 months',
          priority: 'high',
        },
      ],
      strategy: {
        approach: 'SEO-first content strategy with high-volume keyword targeting',
        rationale: 'Based on your traffic goal, this strategy focuses on seo-first content strategy with high-volume keyword targeting',
        keyTactics: [
          'Keyword research for high-volume, low-competition terms',
          'Create comprehensive pillar content (2000+ words)',
          'Internal linking strategy',
          'Technical SEO optimization',
        ],
        successMetrics: [
          'Organic traffic growth',
          'Keyword rankings improvement',
          'Engagement metrics (time on page, bounce rate)',
          'Conversion rate',
        ],
      },
      tasks: [
        {
          id: 'task-1',
          title: 'Research target keywords',
          description: 'Identify high-value keywords aligned with growth goals',
          type: 'research',
          priority: 'critical',
          dependencies: [],
          estimatedDuration: '2 hours',
          status: 'pending',
          requiresApproval: false,
          automatable: true,
        },
        {
          id: 'task-2',
          title: 'Analyze competitor content',
          description: 'Study top-performing competitor content for insights',
          type: 'research',
          priority: 'high',
          dependencies: [],
          estimatedDuration: '3 hours',
          status: 'pending',
          requiresApproval: false,
          automatable: true,
        },
        {
          id: 'task-3',
          title: 'Create pillar content #1',
          description: 'Write comprehensive guide on primary topic',
          type: 'content-creation',
          priority: 'critical',
          dependencies: ['task-1'],
          estimatedDuration: '4 hours',
          status: 'pending',
          requiresApproval: true,
          automatable: true,
        },
        {
          id: 'task-4',
          title: 'Create supporting content #1',
          description: 'Write 3 related articles linking to pillar content',
          type: 'content-creation',
          priority: 'high',
          dependencies: ['task-3'],
          estimatedDuration: '6 hours',
          status: 'pending',
          requiresApproval: false,
          automatable: true,
        },
        {
          id: 'task-5',
          title: 'SEO optimization pass',
          description: 'Optimize all content for target keywords and readability',
          type: 'seo-optimization',
          priority: 'high',
          dependencies: ['task-4'],
          estimatedDuration: '2 hours',
          status: 'pending',
          requiresApproval: false,
          automatable: true,
        },
        {
          id: 'task-6',
          title: 'Publish optimized content',
          description: 'Publish all content to connected platforms',
          type: 'publishing',
          priority: 'critical',
          dependencies: ['task-5'],
          estimatedDuration: '1 hour',
          status: 'pending',
          requiresApproval: true,
          automatable: true,
        },
      ],
      timeline: {
        startDate: new Date(),
        estimatedCompletion: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        milestones: [
          {
            name: 'Research Complete',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            tasks: ['task-1', 'task-2'],
            criteria: ['Keywords identified', 'Competitor analysis done'],
          },
          {
            name: 'Content Created',
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            tasks: ['task-3', 'task-4'],
            criteria: ['Pillar content complete', 'Supporting articles written'],
          },
        ],
      },
      expectedImpact: {
        traffic: '+150-300% over 3 months',
        engagement: '+40-60% time on page',
        conversions: '+25-50% conversion rate',
        confidence: 'medium',
      },
      risks: [
        {
          description: 'Content may not rank immediately (SEO takes 2-3 months)',
          severity: 'medium',
          mitigation: 'Monitor rankings and adjust strategy based on early signals',
        },
        {
          description: 'Automated content may need human review for brand voice',
          severity: 'low',
          mitigation: 'Review and edit content before publishing in conservative mode',
        },
      ],
      createdAt: new Date(),
      status: 'draft',
    }
    
    setPlan(mockPlan)
    setIsGenerating(false)
  }

  const handleExecutePlan = () => {
    setIsExecuting(true)
    // Would trigger actual execution via API
  }

  const getTaskStatusIcon = (status: AgentTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityBadge = (priority: AgentTask['priority']) => {
    const variants: Record<AgentTask['priority'], { variant: any; label: string }> = {
      critical: { variant: 'destructive' as any, label: 'Critical' },
      high: { variant: 'default' as any, label: 'High' },
      medium: { variant: 'secondary' as any, label: 'Medium' },
      low: { variant: 'outline' as any, label: 'Low' },
    }
    const config = variants[priority]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold sm:text-3xl flex items-center gap-2"
          >
            <Brain className="h-8 w-8 text-primary" />
            God Mode
          </motion.h1>
          <p className="mt-1 text-muted-foreground">
            Autonomous AI agent that plans and executes your content growth strategy
          </p>
        </div>
        {!plan && (
          <Button onClick={handleGeneratePlan} disabled={isGenerating} size="lg">
            {isGenerating ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Growth Plan
              </>
            )}
          </Button>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan ? 'Active' : 'None'}</div>
            <p className="text-xs text-muted-foreground">Growth plan status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Automation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan ? plan.tasks.filter(t => t.automatable).length : 0}</div>
            <p className="text-xs text-muted-foreground">Automated tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Balanced</div>
            <p className="text-xs text-muted-foreground">Control level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan?.expectedImpact.confidence || '-'}</div>
            <p className="text-xs text-muted-foreground">Confidence level</p>
          </CardContent>
        </Card>
      </div>

      {/* No Plan State */}
      {!plan && !isGenerating && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Brain className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">AI Growth Agent Ready</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Let the AI analyze your content, goals, and opportunities to create a comprehensive
              growth plan with automated execution.
            </p>
            <Button onClick={handleGeneratePlan} size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Your First Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Plan Details */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Plan Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{plan.title}</CardTitle>
                  <CardDescription className="mt-2">{plan.summary}</CardDescription>
                </div>
                <Badge variant={plan.status === 'executing' ? 'default' : 'secondary'}>
                  {plan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium mb-2">Expected Impact</div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Traffic: {plan.expectedImpact.traffic}</div>
                    <div>Engagement: {plan.expectedImpact.engagement}</div>
                    <div>Conversions: {plan.expectedImpact.conversions}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Timeline</div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Start: {plan.timeline.startDate.toLocaleDateString()}</div>
                    <div>Est. completion: {plan.timeline.estimatedCompletion.toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button onClick={handleExecutePlan} disabled={isExecuting || plan.status === 'executing'}>
                  {isExecuting ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Execution
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Task Pipeline</CardTitle>
                  <CardDescription>
                    {plan.tasks.filter(t => t.status === 'completed').length} of {plan.tasks.length} completed
                  </CardDescription>
                  <Progress
                    value={(plan.tasks.filter(t => t.status === 'completed').length / plan.tasks.length) * 100}
                    className="mt-2"
                  />
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50"
                    >
                      {getTaskStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{task.title}</span>
                          {getPriorityBadge(task.priority)}
                          {task.requiresApproval && (
                            <Badge variant="outline" className="text-xs">
                              Requires approval
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>⏱️ {task.estimatedDuration}</span>
                          <span>🤖 {task.automatable ? 'Automated' : 'Manual'}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Approach</div>
                    <p className="text-sm text-muted-foreground">{plan.strategy.approach}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Rationale</div>
                    <p className="text-sm text-muted-foreground">{plan.strategy.rationale}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Key Tactics</div>
                    <ul className="space-y-2">
                      {plan.strategy.keyTactics.map((tactic, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {tactic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Success Metrics</div>
                    <ul className="space-y-2">
                      {plan.strategy.successMetrics.map((metric, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>Potential challenges and mitigation strategies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.risks.map((risk, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle
                          className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                            risk.severity === 'high'
                              ? 'text-red-500'
                              : risk.severity === 'medium'
                              ? 'text-yellow-500'
                              : 'text-blue-500'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{risk.description}</div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {risk.severity} severity
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-7">
                        <div className="text-sm text-muted-foreground mb-1">Mitigation:</div>
                        <p className="text-sm">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Real-time execution history</CardDescription>
                </CardHeader>
                <CardContent>
                  {activityLog.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No activity yet. Start execution to see live updates.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activityLog.map((log) => (
                        <div key={log.id} className="text-sm border-l-2 border-primary/50 pl-3 py-1">
                          <div className="font-mono text-xs text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </div>
                          <div>{log.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  )
}

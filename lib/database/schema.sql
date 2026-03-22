-- Revenue/Traffic Engine Database Schema
-- PostgreSQL schema for BlogCraft AI transformation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users and Authentication (Enhanced)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  usage_limits JSONB DEFAULT '{}'
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Personalities and Learning System
CREATE TABLE IF NOT EXISTS ai_personalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  learning_model VARCHAR(100) NOT NULL DEFAULT 'adaptive-v1',
  adaptation_level INTEGER NOT NULL DEFAULT 0,
  success_patterns JSONB NOT NULL DEFAULT '[]',
  preferences JSONB NOT NULL DEFAULT '{}',
  brand_voice JSONB DEFAULT '{}',
  target_audience JSONB DEFAULT '{}',
  content_goals JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Records for AI Brain
CREATE TABLE IF NOT EXISTS learning_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID,
  performance_data JSONB NOT NULL,
  insights JSONB NOT NULL,
  adaptations JSONB NOT NULL,
  learning_type VARCHAR(50) NOT NULL, -- 'success_pattern', 'failure_analysis', 'preference_update'
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Content Management
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  performance JSONB NOT NULL DEFAULT '{}',
  monetization JSONB NOT NULL DEFAULT '{}',
  viral_score INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  outcome_metrics JSONB DEFAULT '{}',
  platform_adaptations JSONB DEFAULT '{}',
  automation_workflow_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE
);

-- Platform-specific content adaptations
CREATE TABLE IF NOT EXISTS platform_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  adapted_content TEXT NOT NULL,
  platform_metadata JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft',
  scheduled_time TIMESTAMP WITH TIME ZONE,
  published_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Workflows
CREATE TABLE IF NOT EXISTS automation_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_config JSONB NOT NULL,
  steps JSONB NOT NULL,
  schedule JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  metrics JSONB DEFAULT '{}',
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Executions
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'running',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  execution_log JSONB DEFAULT '[]',
  results JSONB DEFAULT '{}',
  error_details JSONB,
  content_generated INTEGER DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0
);

-- Business Intelligence and Metrics
CREATE TABLE IF NOT EXISTS business_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  revenue_metrics JSONB NOT NULL DEFAULT '{}',
  traffic_metrics JSONB NOT NULL DEFAULT '{}',
  engagement_metrics JSONB NOT NULL DEFAULT '{}',
  conversion_metrics JSONB NOT NULL DEFAULT '{}',
  growth_metrics JSONB NOT NULL DEFAULT '{}',
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue Attribution
CREATE TABLE IF NOT EXISTS revenue_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  attribution_model VARCHAR(50) NOT NULL DEFAULT 'multi-touch',
  direct_revenue DECIMAL(10,2) DEFAULT 0,
  indirect_revenue DECIMAL(10,2) DEFAULT 0,
  conversion_path JSONB DEFAULT '[]',
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE
);

-- Viral Predictions and Analysis
CREATE TABLE IF NOT EXISTS viral_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  viral_score INTEGER NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  breakdown JSONB NOT NULL, -- emotional_triggers, structural_elements, etc.
  optimization_suggestions JSONB DEFAULT '[]',
  actual_performance JSONB, -- filled after content is published
  prediction_accuracy DECIMAL(3,2), -- calculated after performance data available
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  validated_at TIMESTAMP WITH TIME ZONE
);

-- A/B Testing Framework
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_name VARCHAR(255) NOT NULL,
  test_type VARCHAR(50) NOT NULL, -- 'headline', 'cta', 'content', 'timing'
  variants JSONB NOT NULL, -- array of test variants
  traffic_split JSONB NOT NULL, -- percentage allocation
  success_metric VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'running',
  statistical_significance DECIMAL(3,2),
  winner_variant_id VARCHAR(50),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  results JSONB DEFAULT '{}'
);

-- A/B Test Results
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_id VARCHAR(50) NOT NULL,
  content_id UUID REFERENCES content(id),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  engagement_rate DECIMAL(5,4) DEFAULT 0,
  conversion_rate DECIMAL(5,4) DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monetization Elements
CREATE TABLE IF NOT EXISTS monetization_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  element_type VARCHAR(50) NOT NULL, -- 'affiliate_link', 'cta', 'lead_magnet', 'funnel'
  element_data JSONB NOT NULL,
  placement_info JSONB NOT NULL,
  performance_metrics JSONB DEFAULT '{}',
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  conversion_rate DECIMAL(5,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_optimized TIMESTAMP WITH TIME ZONE
);

-- Lead Generation and Funnels
CREATE TABLE IF NOT EXISTS sales_funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  content_id UUID REFERENCES content(id),
  funnel_stages JSONB NOT NULL,
  conversion_goals JSONB NOT NULL,
  automation_rules JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Captures
CREATE TABLE IF NOT EXISTS lead_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id),
  funnel_id UUID REFERENCES sales_funnels(id),
  lead_email VARCHAR(255) NOT NULL,
  lead_data JSONB DEFAULT '{}',
  source_platform VARCHAR(50),
  capture_method VARCHAR(50), -- 'lead_magnet', 'cta', 'form'
  conversion_stage VARCHAR(50) DEFAULT 'lead',
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate Conversions
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE,
  order_value DECIMAL(10,2) DEFAULT 0,
  commission DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Collaboration (Enterprise Features)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'strategist', 'creator', 'analyst', 'manager'
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active'
);

-- Content Approvals
CREATE TABLE IF NOT EXISTS content_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'changes_requested'
  comments TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys and Integrations
CREATE TABLE IF NOT EXISTS api_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  integration_type VARCHAR(50) NOT NULL, -- 'crm', 'email', 'social', 'analytics'
  platform_name VARCHAR(100) NOT NULL,
  credentials JSONB NOT NULL, -- encrypted
  configuration JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Monitoring
CREATE TABLE IF NOT EXISTS performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  response_time INTEGER NOT NULL, -- milliseconds
  status_code INTEGER NOT NULL,
  user_id UUID REFERENCES users(id),
  error_details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active);

CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at);
CREATE INDEX IF NOT EXISTS idx_content_viral_score ON content(viral_score);
CREATE INDEX IF NOT EXISTS idx_content_seo_score ON content(seo_score);

CREATE INDEX IF NOT EXISTS idx_platform_content_content_id ON platform_content(content_id);
CREATE INDEX IF NOT EXISTS idx_platform_content_platform ON platform_content(platform);
CREATE INDEX IF NOT EXISTS idx_platform_content_status ON platform_content(status);

CREATE INDEX IF NOT EXISTS idx_ai_personalities_user_id ON ai_personalities(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_user_id ON learning_records(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_content_id ON learning_records(content_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_type ON learning_records(learning_type);

CREATE INDEX IF NOT EXISTS idx_automation_workflows_user_id ON automation_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_status ON automation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);

CREATE INDEX IF NOT EXISTS idx_business_metrics_user_period ON business_metrics(user_id, period);
CREATE INDEX IF NOT EXISTS idx_business_metrics_period_start ON business_metrics(period_start);

CREATE INDEX IF NOT EXISTS idx_revenue_attribution_user_id ON revenue_attribution(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_attribution_content_id ON revenue_attribution(content_id);

CREATE INDEX IF NOT EXISTS idx_viral_predictions_content_id ON viral_predictions(content_id);
CREATE INDEX IF NOT EXISTS idx_viral_predictions_viral_score ON viral_predictions(viral_score);

CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_id ON ab_test_results(test_id);

CREATE INDEX IF NOT EXISTS idx_monetization_elements_content_id ON monetization_elements(content_id);
CREATE INDEX IF NOT EXISTS idx_monetization_elements_type ON monetization_elements(element_type);

CREATE INDEX IF NOT EXISTS idx_sales_funnels_user_id ON sales_funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_captures_user_id ON lead_captures(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_captures_content_id ON lead_captures(content_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_content_id ON affiliate_conversions(content_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_user_id ON affiliate_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_product_id ON affiliate_conversions(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_status ON affiliate_conversions(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_clicked_at ON affiliate_conversions(clicked_at);

CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_content_approvals_content_id ON content_approvals(content_id);

CREATE INDEX IF NOT EXISTS idx_api_integrations_user_id ON api_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_api_integrations_type ON api_integrations(integration_type);

CREATE INDEX IF NOT EXISTS idx_performance_logs_endpoint ON performance_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_performance_logs_timestamp ON performance_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_logs_response_time ON performance_logs(response_time);
/**
 * @file app/api/action-plan/save/route.ts
 * @description API endpoint to save action plans to Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      // If not authenticated, save to localStorage only (client-side)
      return NextResponse.json({ 
        success: false, 
        message: 'Not authenticated. Plan saved to localStorage only.',
        requiresAuth: true 
      }, { status: 200 })
    }

    const body = await request.json()
    const { plan } = body

    if (!plan) {
      return NextResponse.json({ error: 'Plan data is required' }, { status: 400 })
    }

    // Check if user already has an action plan
    const { data: existingPlans } = await supabase
      .from('action_plans')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingPlans) {
      // Update existing plan
      const { error: updateError } = await supabase
        .from('action_plans')
        .update({
          pathways: plan.pathways,
          selected_opportunities: plan,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('[SaveActionPlan] Update error:', updateError)
        return NextResponse.json({ error: 'Failed to update action plan' }, { status: 500 })
      }
    } else {
      // Create new plan
      const { error: insertError } = await supabase
        .from('action_plans')
        .insert({
          user_id: user.id,
          pathways: plan.pathways,
          selected_opportunities: plan,
          status: 'active'
        })

      if (insertError) {
        console.error('[SaveActionPlan] Insert error:', insertError)
        return NextResponse.json({ error: 'Failed to save action plan' }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Action plan saved successfully' 
    })
  } catch (error) {
    console.error('[SaveActionPlan] Error:', error)
    return NextResponse.json({ 
      error: 'Failed to save action plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}



/**
 * @file app/api/action-plan/load/route.ts
 * @description API endpoint to load action plans from Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-client'

export async function GET(_request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Not authenticated',
        requiresAuth: true 
      }, { status: 200 })
    }

    // Load user's action plan
    const { data: actionPlan, error } = await supabase
      .from('action_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No action plan found
        return NextResponse.json({ 
          success: true, 
          plan: null,
          message: 'No action plan found'
        })
      }
      console.error('[LoadActionPlan] Error:', error)
      return NextResponse.json({ error: 'Failed to load action plan' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      plan: actionPlan.selected_opportunities 
    })
  } catch (error) {
    console.error('[LoadActionPlan] Error:', error)
    return NextResponse.json({ 
      error: 'Failed to load action plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}



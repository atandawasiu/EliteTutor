export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          active: boolean
          body: string
          created_at: string
          expires_at: string | null
          id: string
          sort_order: number
          title: string
          type: string
        }
        Insert: {
          active?: boolean
          body: string
          created_at?: string
          expires_at?: string | null
          id?: string
          sort_order?: number
          title: string
          type?: string
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          sort_order?: number
          title?: string
          type?: string
        }
        Relationships: []
      }
      attempt_answers: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          selected_answer: string | null
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id: string
          selected_answer?: string | null
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attempt_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      attempts: {
        Row: {
          completed: boolean
          correct_count: number
          created_at: string
          exam_id: string
          id: string
          score: number
          subject_id: string | null
          time_taken_seconds: number
          total_questions: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          correct_count?: number
          created_at?: string
          exam_id: string
          id?: string
          score?: number
          subject_id?: string | null
          time_taken_seconds?: number
          total_questions: number
          user_id: string
        }
        Update: {
          completed?: boolean
          correct_count?: number
          created_at?: string
          exam_id?: string
          id?: string
          score?: number
          subject_id?: string | null
          time_taken_seconds?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempts_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          id: string
          row_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          row_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          row_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          block_key: string
          block_type: string
          body: string
          created_at: string
          icon: string | null
          id: string
          image_url: string | null
          link_label: string | null
          link_url: string | null
          metadata: Json
          page_slug: string
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          block_key: string
          block_type?: string
          body?: string
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          link_label?: string | null
          link_url?: string | null
          metadata?: Json
          page_slug?: string
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          block_key?: string
          block_type?: string
          body?: string
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          link_label?: string | null
          link_url?: string | null
          metadata?: Json
          page_slug?: string
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      daily_questions: {
        Row: {
          created_at: string
          id: string
          question_id: string
          scheduled_for: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          scheduled_for: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          scheduled_for?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          country: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          exam_type: Database["public"]["Enums"]["exam_type"]
          id: string
          is_premium: boolean
          name: string
          region: Database["public"]["Enums"]["exam_region"]
          slug: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          is_premium?: boolean
          name: string
          region?: Database["public"]["Enums"]["exam_region"]
          slug: string
        }
        Update: {
          country?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          is_premium?: boolean
          name?: string
          region?: Database["public"]["Enums"]["exam_region"]
          slug?: string
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          column_title: string
          created_at: string
          id: string
          label: string
          sort_order: number
          updated_at: string
          url: string
          visible: boolean
        }
        Insert: {
          column_title: string
          created_at?: string
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Update: {
          column_title?: string
          created_at?: string
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Relationships: []
      }
      forum_likes: {
        Row: {
          created_at: string
          id: string
          reply_id: string | null
          thread_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          parent_id: string | null
          thread_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          parent_id?: string | null
          thread_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string
          body: string
          category: string | null
          created_at: string
          id: string
          locked: boolean
          pinned: boolean
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          body: string
          category?: string | null
          created_at?: string
          id?: string
          locked?: boolean
          pinned?: boolean
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          body?: string
          category?: string | null
          created_at?: string
          id?: string
          locked?: boolean
          pinned?: boolean
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          daily_goal_minutes: number | null
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          onboarded: boolean
          plan: Database["public"]["Enums"]["user_plan"]
          selected_exam_ids: string[] | null
          selected_subject_ids: string[] | null
          state: string | null
          student_code: string | null
          target_course: string | null
          target_school: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          daily_goal_minutes?: number | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          onboarded?: boolean
          plan?: Database["public"]["Enums"]["user_plan"]
          selected_exam_ids?: string[] | null
          selected_subject_ids?: string[] | null
          state?: string | null
          student_code?: string | null
          target_course?: string | null
          target_school?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          daily_goal_minutes?: number | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          onboarded?: boolean
          plan?: Database["public"]["Enums"]["user_plan"]
          selected_exam_ids?: string[] | null
          selected_subject_ids?: string[] | null
          state?: string | null
          student_code?: string | null
          target_course?: string | null
          target_school?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty"]
          explanation: string | null
          id: string
          options: Json
          question: string
          subject_id: string
          topic: string | null
          year: number | null
        }
        Insert: {
          correct_answer: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          explanation?: string | null
          id?: string
          options: Json
          question: string
          subject_id: string
          topic?: string | null
          year?: number | null
        }
        Update: {
          correct_answer?: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          subject_id?: string
          topic?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          accreditation: Database["public"]["Enums"]["accreditation_status"]
          country: string
          courses: string[] | null
          created_at: string
          cutoff_score: number | null
          description: string | null
          fees_max: number | null
          fees_min: number | null
          id: string
          location: string | null
          logo_url: string | null
          name: string
          ownership: Database["public"]["Enums"]["school_ownership"]
          school_type: Database["public"]["Enums"]["school_type"]
          slug: string
          state: string | null
          website_url: string | null
        }
        Insert: {
          accreditation?: Database["public"]["Enums"]["accreditation_status"]
          country?: string
          courses?: string[] | null
          created_at?: string
          cutoff_score?: number | null
          description?: string | null
          fees_max?: number | null
          fees_min?: number | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name: string
          ownership?: Database["public"]["Enums"]["school_ownership"]
          school_type?: Database["public"]["Enums"]["school_type"]
          slug: string
          state?: string | null
          website_url?: string | null
        }
        Update: {
          accreditation?: Database["public"]["Enums"]["accreditation_status"]
          country?: string
          courses?: string[] | null
          created_at?: string
          cutoff_score?: number | null
          description?: string | null
          fees_max?: number | null
          fees_min?: number | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name?: string
          ownership?: Database["public"]["Enums"]["school_ownership"]
          school_type?: Database["public"]["Enums"]["school_type"]
          slug?: string
          state?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      site_menu_links: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          label: string
          section_id: string
          sort_order: number
          updated_at: string
          url: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          label: string
          section_id: string
          sort_order?: number
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          label?: string
          section_id?: string
          sort_order?: number
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "site_menu_links_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "site_menu_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      site_menu_sections: {
        Row: {
          created_at: string
          icon: string
          id: string
          label: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          brand_name: string
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          copyright_text: string
          footer_about: string
          header_announcement: string | null
          id: string
          legal_tagline: string
          logo_url: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_twitter: string | null
          social_whatsapp: string | null
          social_youtube: string | null
          tagline: string
          updated_at: string
        }
        Insert: {
          brand_name?: string
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          copyright_text?: string
          footer_about?: string
          header_announcement?: string | null
          id?: string
          legal_tagline?: string
          logo_url?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_whatsapp?: string | null
          social_youtube?: string | null
          tagline?: string
          updated_at?: string
        }
        Update: {
          brand_name?: string
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          copyright_text?: string
          footer_about?: string
          header_announcement?: string | null
          id?: string
          legal_tagline?: string
          logo_url?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_whatsapp?: string | null
          social_youtube?: string | null
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          exam_id: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          exam_id: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          exam_id?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          approved: boolean
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          quote: string
          rating: number
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          approved?: boolean
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          quote: string
          rating?: number
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          approved?: boolean
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          quote?: string
          rating?: number
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_icon: string | null
          badge_key: string
          badge_name: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_icon?: string | null
          badge_key: string
          badge_name: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_icon?: string | null
          badge_key?: string
          badge_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          created_at: string
          id: string
          points: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_badge: { Args: { _badge_key: string }; Returns: undefined }
      award_points: {
        Args: { _points: number; _reason: string }
        Returns: undefined
      }
      generate_student_code: { Args: never; Returns: string }
      get_audit_trigger_status: {
        Args: never
        Returns: {
          has_audit_trigger: boolean
          table_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      accreditation_status:
        | "full"
        | "provisional"
        | "not_accredited"
        | "unknown"
      app_role:
        | "admin"
        | "contributor"
        | "student"
        | "agent"
        | "cbt_centre"
        | "edu_consultant"
      difficulty: "easy" | "medium" | "hard"
      exam_region: "africa" | "international"
      exam_type: "objective" | "theory" | "hybrid"
      school_ownership: "federal" | "state" | "private" | "other"
      school_type:
        | "university"
        | "polytechnic"
        | "college_of_education"
        | "monotechnic"
        | "secondary"
        | "other"
      user_plan: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      accreditation_status: [
        "full",
        "provisional",
        "not_accredited",
        "unknown",
      ],
      app_role: [
        "admin",
        "contributor",
        "student",
        "agent",
        "cbt_centre",
        "edu_consultant",
      ],
      difficulty: ["easy", "medium", "hard"],
      exam_region: ["africa", "international"],
      exam_type: ["objective", "theory", "hybrid"],
      school_ownership: ["federal", "state", "private", "other"],
      school_type: [
        "university",
        "polytechnic",
        "college_of_education",
        "monotechnic",
        "secondary",
        "other",
      ],
      user_plan: ["free", "premium"],
    },
  },
} as const

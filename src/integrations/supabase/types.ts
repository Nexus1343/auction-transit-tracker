export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auctions: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      body_types: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      container_prices: {
        Row: {
          created_at: string | null
          id: number
          port: string | null
          price: number
          updated_at: string | null
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          port?: string | null
          price: number
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          port?: string | null
          price?: number
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      dealers: {
        Row: {
          buyer_id: string | null
          buyer_id_2: string | null
          container_price_id: number | null
          created_at: string | null
          dealer_fee: number | null
          dealer_fee_2: number | null
          email: string | null
          id: number
          mobile: string | null
          name: string
          password: string | null
          transport_price_id: number | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          buyer_id?: string | null
          buyer_id_2?: string | null
          container_price_id?: number | null
          created_at?: string | null
          dealer_fee?: number | null
          dealer_fee_2?: number | null
          email?: string | null
          id?: number
          mobile?: string | null
          name: string
          password?: string | null
          transport_price_id?: number | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          buyer_id?: string | null
          buyer_id_2?: string | null
          container_price_id?: number | null
          created_at?: string | null
          dealer_fee?: number | null
          dealer_fee_2?: number | null
          email?: string | null
          id?: number
          mobile?: string | null
          name?: string
          password?: string | null
          transport_price_id?: number | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dealers_container_price_id_fkey"
            columns: ["container_price_id"]
            isOneToOne: false
            referencedRelation: "container_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealers_transport_price_id_fkey"
            columns: ["transport_price_id"]
            isOneToOne: false
            referencedRelation: "transport_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          document_type: string | null
          document_url: string
          id: number
          uploaded_by: number | null
          vehicle_id: number | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          document_url: string
          id?: number
          uploaded_by?: number | null
          vehicle_id?: number | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          document_url?: string
          id?: number
          uploaded_by?: number | null
          vehicle_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      generations: {
        Row: {
          created_at: string | null
          id: number
          model_id: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          model_id?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          model_id?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generations_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      land_transportation: {
        Row: {
          balance_payment_method: string | null
          balance_payment_time: string | null
          company_name: string | null
          created_at: string | null
          delivery_date: string | null
          delivery_date_status: string | null
          id: number
          mc_number: string | null
          pickup_date: string | null
          pickup_date_status: string | null
          storage_fee: number | null
          storage_start_date: string | null
          transport_listed_price: number | null
          transporter_name: string | null
          transporter_payment_date: string | null
          transporter_phone: string | null
          updated_at: string | null
          vehicle_id: number | null
        }
        Insert: {
          balance_payment_method?: string | null
          balance_payment_time?: string | null
          company_name?: string | null
          created_at?: string | null
          delivery_date?: string | null
          delivery_date_status?: string | null
          id?: number
          mc_number?: string | null
          pickup_date?: string | null
          pickup_date_status?: string | null
          storage_fee?: number | null
          storage_start_date?: string | null
          transport_listed_price?: number | null
          transporter_name?: string | null
          transporter_payment_date?: string | null
          transporter_phone?: string | null
          updated_at?: string | null
          vehicle_id?: number | null
        }
        Update: {
          balance_payment_method?: string | null
          balance_payment_time?: string | null
          company_name?: string | null
          created_at?: string | null
          delivery_date?: string | null
          delivery_date_status?: string | null
          id?: number
          mc_number?: string | null
          pickup_date?: string | null
          pickup_date_status?: string | null
          storage_fee?: number | null
          storage_start_date?: string | null
          transport_listed_price?: number | null
          transporter_name?: string | null
          transporter_payment_date?: string | null
          transporter_phone?: string | null
          updated_at?: string | null
          vehicle_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "land_transportation_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturers: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      models: {
        Row: {
          created_at: string | null
          id: number
          manufacturer_id: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          manufacturer_id?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          manufacturer_id?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "models_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ports: {
        Row: {
          country: string
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: number
          permission_id: number
          role_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          permission_id: number
          role_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          permission_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          id: number
          name: string
          permissions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          permissions?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          permissions?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      sea_transportation: {
        Row: {
          booking_number: string | null
          container_entry_date: string | null
          container_load_date: string | null
          container_number: string | null
          container_open_date: string | null
          created_at: string | null
          green_date: string | null
          id: number
          planned_arrival_date: string | null
          receiving_company: string | null
          shipping_company_name: string | null
          shipping_line_id: number | null
          updated_at: string | null
          vehicle_id: number | null
        }
        Insert: {
          booking_number?: string | null
          container_entry_date?: string | null
          container_load_date?: string | null
          container_number?: string | null
          container_open_date?: string | null
          created_at?: string | null
          green_date?: string | null
          id?: number
          planned_arrival_date?: string | null
          receiving_company?: string | null
          shipping_company_name?: string | null
          shipping_line_id?: number | null
          updated_at?: string | null
          vehicle_id?: number | null
        }
        Update: {
          booking_number?: string | null
          container_entry_date?: string | null
          container_load_date?: string | null
          container_number?: string | null
          container_open_date?: string | null
          created_at?: string | null
          green_date?: string | null
          id?: number
          planned_arrival_date?: string | null
          receiving_company?: string | null
          shipping_company_name?: string | null
          shipping_line_id?: number | null
          updated_at?: string | null
          vehicle_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sea_transportation_shipping_line_id_fkey"
            columns: ["shipping_line_id"]
            isOneToOne: false
            referencedRelation: "shipping_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sea_transportation_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_lines: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      status_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          sequence_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          sequence_order: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          sequence_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      sub_dealers: {
        Row: {
          created_at: string | null
          dealer_fee: number | null
          dealer_id: number | null
          email: string | null
          id: number
          mobile: string | null
          name: string
          password: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dealer_fee?: number | null
          dealer_id?: number | null
          email?: string | null
          id?: number
          mobile?: string | null
          name: string
          password?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dealer_fee?: number | null
          dealer_id?: number | null
          email?: string | null
          id?: number
          mobile?: string | null
          name?: string
          password?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_dealers_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      title_statuses: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      title_types: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transport_prices: {
        Row: {
          city: string | null
          city2: string | null
          created_at: string | null
          id: number
          port: string | null
          price: number
          state: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          city2?: string | null
          created_at?: string | null
          id?: number
          port?: string | null
          price: number
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          city2?: string | null
          created_at?: string | null
          id?: number
          port?: string | null
          price?: number
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          id: number
          permission_id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          permission_id: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          permission_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          auth_id: string | null
          created_at: string | null
          dealer_id: number | null
          email: string
          id: number
          mobile: string | null
          name: string
          role_id: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          dealer_id?: number | null
          email: string
          id?: number
          mobile?: string | null
          name: string
          role_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          dealer_id?: number | null
          email?: string
          id?: number
          mobile?: string | null
          name?: string
          role_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_images: {
        Row: {
          created_at: string | null
          id: number
          image_type: string | null
          image_url: string
          uploaded_by: number | null
          vehicle_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_type?: string | null
          image_url: string
          uploaded_by?: number | null
          vehicle_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_type?: string | null
          image_url?: string
          uploaded_by?: number | null
          vehicle_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_status_history: {
        Row: {
          changed_by: number | null
          created_at: string | null
          id: number
          notes: string | null
          status_id: number | null
          vehicle_id: number | null
        }
        Insert: {
          changed_by?: number | null
          created_at?: string | null
          id?: number
          notes?: string | null
          status_id?: number | null
          vehicle_id?: number | null
        }
        Update: {
          changed_by?: number | null
          created_at?: string | null
          id?: number
          notes?: string | null
          status_id?: number | null
          vehicle_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_status_history_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "status_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_status_history_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          address: string | null
          auction_due_date: string | null
          auction_final_price: number | null
          auction_id: number | null
          auction_pay_date: string | null
          auction_won_price: number | null
          body_type_id: number | null
          city: string | null
          client_buyer_id: string | null
          client_name: string | null
          client_passport_number: string | null
          client_phone_number: string | null
          created_at: string | null
          created_by: number | null
          current_status_id: number | null
          dealer_id: number | null
          destination: string | null
          gate_pass_pin: string | null
          generation_id: number | null
          has_key: boolean | null
          highlights: string | null
          id: number
          is_sublot: boolean | null
          lot_number: string | null
          manufacturer_id: number | null
          model_id: number | null
          pay_due_date: string | null
          purchase_date: string | null
          receiver_port_id: number | null
          state: string | null
          stock_number: string | null
          sub_dealer_id: number | null
          title_status_id: number | null
          title_type_id: number | null
          updated_at: string | null
          vin: string | null
          warehouse_id: number | null
          year: number | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          auction_due_date?: string | null
          auction_final_price?: number | null
          auction_id?: number | null
          auction_pay_date?: string | null
          auction_won_price?: number | null
          body_type_id?: number | null
          city?: string | null
          client_buyer_id?: string | null
          client_name?: string | null
          client_passport_number?: string | null
          client_phone_number?: string | null
          created_at?: string | null
          created_by?: number | null
          current_status_id?: number | null
          dealer_id?: number | null
          destination?: string | null
          gate_pass_pin?: string | null
          generation_id?: number | null
          has_key?: boolean | null
          highlights?: string | null
          id?: number
          is_sublot?: boolean | null
          lot_number?: string | null
          manufacturer_id?: number | null
          model_id?: number | null
          pay_due_date?: string | null
          purchase_date?: string | null
          receiver_port_id?: number | null
          state?: string | null
          stock_number?: string | null
          sub_dealer_id?: number | null
          title_status_id?: number | null
          title_type_id?: number | null
          updated_at?: string | null
          vin?: string | null
          warehouse_id?: number | null
          year?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          auction_due_date?: string | null
          auction_final_price?: number | null
          auction_id?: number | null
          auction_pay_date?: string | null
          auction_won_price?: number | null
          body_type_id?: number | null
          city?: string | null
          client_buyer_id?: string | null
          client_name?: string | null
          client_passport_number?: string | null
          client_phone_number?: string | null
          created_at?: string | null
          created_by?: number | null
          current_status_id?: number | null
          dealer_id?: number | null
          destination?: string | null
          gate_pass_pin?: string | null
          generation_id?: number | null
          has_key?: boolean | null
          highlights?: string | null
          id?: number
          is_sublot?: boolean | null
          lot_number?: string | null
          manufacturer_id?: number | null
          model_id?: number | null
          pay_due_date?: string | null
          purchase_date?: string | null
          receiver_port_id?: number | null
          state?: string | null
          stock_number?: string | null
          sub_dealer_id?: number | null
          title_status_id?: number | null
          title_type_id?: number | null
          updated_at?: string | null
          vin?: string | null
          warehouse_id?: number | null
          year?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_body_type_id_fkey"
            columns: ["body_type_id"]
            isOneToOne: false
            referencedRelation: "body_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_current_status_id_fkey"
            columns: ["current_status_id"]
            isOneToOne: false
            referencedRelation: "status_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_receiver_port_id_fkey"
            columns: ["receiver_port_id"]
            isOneToOne: false
            referencedRelation: "ports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_sub_dealer_id_fkey"
            columns: ["sub_dealer_id"]
            isOneToOne: false
            referencedRelation: "sub_dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_title_status_id_fkey"
            columns: ["title_status_id"]
            isOneToOne: false
            referencedRelation: "title_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_title_type_id_fkey"
            columns: ["title_type_id"]
            isOneToOne: false
            referencedRelation: "title_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          created_at: string | null
          id: number
          is_destination: boolean | null
          name: string
          port_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_destination?: boolean | null
          name: string
          port_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_destination?: boolean | null
          name?: string
          port_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_port_id_fkey"
            columns: ["port_id"]
            isOneToOne: false
            referencedRelation: "ports"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">SubCategories Management</h1>
        <p class="mt-2 text-sm text-gray-600">Akademi - Create and manage subcategories</p>
      </div>

      <!-- Create SubCategory Form Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
          Create New SubCategory
        </h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Category Selection -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Category <span class="text-red-500">*</span>
            </label>
            <select 
              id="category" 
              v-model="formData.category_id" 
              required
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="" disabled>Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Course Selection -->
          <div>
            <label for="course" class="block text-sm font-medium text-gray-700 mb-2">
              Course <span class="text-gray-400 text-xs">(Optional)</span>
            </label>
            <select 
              id="course" 
              v-model="formData.course_id"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="" disabled>Select a course</option>
              <option v-for="course in filteredCourses" :key="course.id" :value="course.id">
                {{ course.name }}
              </option>
            </select>
            <p v-if="!formData.category_id" class="mt-1 text-xs text-gray-500">
              Please select a category first
            </p>
          </div>

          <!-- SubCategory Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              SubCategory Name <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              required
              placeholder="e.g., Web Development Fundamentals"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              rows="4"
              placeholder="Enter a detailed description of this subcategory..."
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
            ></textarea>
          </div>

          <!-- Status Toggle -->
          <div class="flex items-center gap-2">
            <div class="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="is_active" 
                v-model="formData.is_active"
                class="sr-only"
              />
              <div 
                @click="formData.is_active = !formData.is_active"
                :class="[
                  'block w-10 h-6 rounded-full cursor-pointer transition-colors duration-200',
                  formData.is_active ? 'bg-blue-600' : 'bg-gray-300'
                ]"
              >
                <div 
                  :class="[
                    'dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200',
                    formData.is_active ? 'transform translate-x-4' : ''
                  ]"
                ></div>
              </div>
            </div>
            <label for="is_active" class="text-sm font-medium text-gray-700 cursor-pointer" @click="formData.is_active = !formData.is_active">
              {{ formData.is_active ? 'Active' : 'Inactive' }}
            </label>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center gap-4 pt-4">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Creating...' : 'Create SubCategory' }}
            </button>
            <button 
              type="button" 
              @click="resetForm"
              class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Recent SubCategories List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Recent SubCategories</h2>
          <span class="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full">
            Total: {{ subcategories.length }}
          </span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-500">Loading subcategories...</p>
        </div>

        <!-- Table View with 3 rows of complete data -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-y border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="sub in subcategories" :key="sub.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-900 font-medium">#{{ sub.id }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ sub.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {{ sub.category_name }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <span v-if="sub.course_name" class="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    {{ sub.course_name }}
                  </span>
                  <span v-else class="text-gray-400 italic">—</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  <p class="truncate" :title="sub.description">{{ sub.description }}</p>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    sub.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ sub.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex items-center gap-2">
                    <button @click="editSubcategory(sub)" class="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button @click="deleteSubcategory(sub.id)" class="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'

export default {
  name: 'SubCategories',
  
  setup() {
    // Form data
    const formData = reactive({
      category_id: '',
      course_id: '',
      name: '',
      description: '',
      is_active: true
    })

    // State with complete mock data - only 3 rows
    const categories = ref([
      { id: 1, name: 'Programming' },
      { id: 2, name: 'Design' },
      { id: 3, name: 'Business' }
    ])
    
    const courses = ref([
      { id: 1, name: 'Web Development', category_id: 1 },
      { id: 2, name: 'Python Basics', category_id: 1 },
      { id: 3, name: 'UI/UX Design', category_id: 2 },
      { id: 4, name: 'Graphic Design', category_id: 2 },
      { id: 5, name: 'Marketing 101', category_id: 3 }
    ])
    
    // Only 3 subcategories with COMPLETE data
    const subcategories = ref([
      { 
        id: 1, 
        name: 'Frontend Development', 
        category_id: 1, 
        category_name: 'Programming',
        course_id: 1,
        course_name: 'Web Development',
        description: 'Learn HTML, CSS, JavaScript, and modern frontend frameworks like React and Vue. This subcategory covers everything from basics to advanced concepts in frontend web development.',
        is_active: true 
      },
      { 
        id: 2, 
        name: 'Color Theory', 
        category_id: 2, 
        category_name: 'Design',
        course_id: 3,
        course_name: 'UI/UX Design',
        description: 'Master the art of color combinations, psychology of colors, and how to create visually appealing designs using color theory principles and best practices.',
        is_active: true 
      },
      { 
        id: 3, 
        name: 'Digital Marketing', 
        category_id: 3, 
        category_name: 'Business',
        course_id: 5,
        course_name: 'Marketing 101',
        description: 'Comprehensive guide to digital marketing including SEO, social media marketing, email campaigns, and analytics. Perfect for beginners and professionals.',
        is_active: false 
      }
    ])
    
    const loading = ref(false)
    const isSubmitting = ref(false)

    // Filter courses based on selected category
    const filteredCourses = computed(() => {
      if (!formData.category_id) return []
      return courses.value.filter(c => c.category_id === formData.category_id)
    })

    // Mock fetch function
    const fetchData = async () => {
      loading.value = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Data loaded with mock data')
      } catch (error) {
        console.error('Error:', error)
      } finally {
        loading.value = false
      }
    }

    // Handle form submission
    const handleSubmit = async () => {
      isSubmitting.value = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Create new subcategory with mock data
        const newSub = {
          id: subcategories.value.length + 1,
          name: formData.name,
          category_id: formData.category_id,
          category_name: categories.value.find(c => c.id === formData.category_id)?.name,
          course_id: formData.course_id || null,
          course_name: formData.course_id ? courses.value.find(c => c.id === formData.course_id)?.name : null,
          description: formData.description || 'No description provided',
          is_active: formData.is_active
        }
        
        subcategories.value.unshift(newSub)
        resetForm()
        alert('SubCategory created successfully!')
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to create subcategory.')
      } finally {
        isSubmitting.value = false
      }
    }

    // Reset form
    const resetForm = () => {
      formData.category_id = ''
      formData.course_id = ''
      formData.name = ''
      formData.description = ''
      formData.is_active = true
    }

    // Edit subcategory
    const editSubcategory = (subcategory) => {
      formData.category_id = subcategory.category_id
      formData.course_id = subcategory.course_id || ''
      formData.name = subcategory.name
      formData.description = subcategory.description || ''
      formData.is_active = subcategory.is_active
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Delete subcategory
    const deleteSubcategory = async (id) => {
      if (!confirm('Are you sure you want to delete this subcategory?')) return
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        subcategories.value = subcategories.value.filter(s => s.id !== id)
        alert('SubCategory deleted successfully!')
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to delete subcategory.')
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      formData,
      categories,
      courses,
      subcategories,
      loading,
      isSubmitting,
      filteredCourses,
      handleSubmit,
      resetForm,
      editSubcategory,
      deleteSubcategory
    }
  }
}
</script>
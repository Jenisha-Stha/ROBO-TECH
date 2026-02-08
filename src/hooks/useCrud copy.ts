import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showError, showSuccess } from "../utils/toast";
import api from "@/utils/api";

type Pagination = {
    searchTerm?: string;
    page?: number;
    limit?: number;
};

export function useCrud<T>(
    baseUrl: string,
    entityName: string, // Used for toast and queryKey
    pagination?: Pagination,
    id?: number | null
) {
    const queryClient = useQueryClient();

    const queryKey = [entityName, pagination?.searchTerm || "", pagination?.page || 1, pagination?.limit || 10];

    // ✅ List
    const listQuery = useQuery<T[]>({
        queryKey,
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(pagination?.page || 1),
                limit: String(pagination?.limit || 10),
                ...(pagination?.searchTerm ? { searchTerm: pagination.searchTerm } : {}),
            });
            const response = await api.get(`${baseUrl}?${params}`);
            console.log("asdasdasdas", response)
            return response.data;
        },
    });

    // ✅ Single item
    const itemQuery = useQuery<T>({
        queryKey: [entityName, id],
        enabled: !!id,
        queryFn: async () => {
            const response = await api.get(`${baseUrl}/${id}`);
            return response.data;
        },
    });

    // ✅ Create
    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await axios.post(baseUrl, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityName] });
            showSuccess(`${entityName} created successfully`);
        },
        onError: () => {
            showError(`Failed to create ${entityName}`);
        },
    });

    // ✅ Update
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: any }) => {
            const response = await axios.put(`${baseUrl}/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityName] });
            showSuccess(`${entityName} updated successfully`);
        },
        onError: () => {
            showError(`Failed to update ${entityName}`);
        },
    });

    // ✅ Delete
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await axios.delete(`${baseUrl}/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityName] });
            showSuccess(`${entityName} deleted successfully`);
        },
        onError: () => {
            showError(`Failed to delete ${entityName}`);
        },
    });

    return {
        list: listQuery.data,
        isLoadingList: listQuery.isLoading,
        item: itemQuery.data,
        isLoadingItem: itemQuery.isLoading,
        create: createMutation.mutate,
        update: updateMutation.mutate,
        remove: deleteMutation.mutate,
    };
}

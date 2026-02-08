import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const DatabaseTest: React.FC = () => {
    const [testResults, setTestResults] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);

    const testManualQuery = async () => {
        console.log('=== MANUAL QUERY TEST ===');
        try {
            console.log('Step 1: Checking Supabase client...');
            console.log('Supabase client:', supabase);

            console.log('Step 2: Getting current user with timeout...');

            // // Add timeout to prevent hanging
            // const timeoutPromise = new Promise((_, reject) => {
            //     setTimeout(() => reject(new Error('getUser timeout after 5 seconds')), 5000);
            // });

            // const userPromise = supabase.auth.getUser();

            // const result = await Promise.race([userPromise, timeoutPromise]) as any;
            // const { data: { user }, error: userError } = result;
            // console.log('User result:', { user, userError });

            // if (userError) {
            //     alert('Error getting user: ' + userError.message);
            //     return;
            // }

            // if (!user) {
            //     alert('No user found - please sign in first');
            //     return;
            // }
            console.log("user tyep test");
            let { data: user_types, error } = await supabase
                .from('user_types')
                .select('*')
            console.log("user_types", user_types);
            console.log("error", error);

            console.log('Step 3: Testing simple query...');
            const { data: simpleData, error: simpleError } = await supabase
                .from('profiles')
                .select('*')
                // .eq('id', user.id)
                .single();

            console.log('Simple query result:', { data: simpleData, error: simpleError });

            if (simpleError) {
                alert('Simple query error: ' + simpleError.message);
                return;
            }

            alert('Simple query SUCCESS! Profile found: ' + JSON.stringify(simpleData, null, 2));

        } catch (e) {
            console.error('Manual query error:', e);
            alert('Manual query error: ' + e);
        }
    };

    const runTests = async () => {
        setIsLoading(true);
        const results: any = {};

        try {
            console.log("=== STARTING TESTS ===");

            // Test 0: Check if supabase client is working
            console.log("Test 0: Checking Supabase client...");
            console.log("Supabase client:", supabase);
            results.supabaseClient = "OK";

            // Test 1: Get current user
            console.log("Test 1: Getting current user...");
            const { data: { user }, error: userError } = await supabase.auth.getUser().then((res) => {
                console.log("User result:", { user: res.data.user, error: res.error });
                return res;
            }).catch((err) => {
                console.error("Error getting user:", err);
                return err;
            });
            console.log("User result:", { user, userError });
            results.currentUser = { user, userError };

            if (userError) {
                console.error("Error getting user:", userError);
                results.error = userError;
                setTestResults(results);
                setIsLoading(false);
                return;
            }

            if (user) {
                // Test 2: Try to get profile without RLS
                try {
                    console.log('Testing direct profile query...');
                    const { data: profileDirect, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    results.profileDirect = { data: profileDirect, error: profileError };
                    console.log('Profile direct query:', { data: profileDirect, error: profileError });
                } catch (e) {
                    results.profileDirect = { error: e };
                    console.error('Direct query error:', e);
                }

                // Test 3: Try to get profile with RLS (should work now)
                try {
                    console.log('Testing RLS profile query...');
                    const { data: profileRLS, error: profileRLSError } = await supabase
                        .from('profiles')
                        .select(`
              id,
              full_name,
              avatar_url,
              user_type_id,
              user_types (
                id,
                name
              )
            `)
                        .eq('id', user.id)
                        .single();

                    results.profileRLS = { data: profileRLS, error: profileRLSError };
                    console.log('Profile RLS query:', { data: profileRLS, error: profileRLSError });
                } catch (e) {
                    results.profileRLS = { error: e };
                    console.error('RLS query error:', e);
                }

                // Test 4: Check user types table
                try {
                    const { data: userTypes, error: userTypesError } = await supabase
                        .from('user_types')
                        .select('*');

                    results.userTypes = { data: userTypes, error: userTypesError };
                    console.log('User types:', { data: userTypes, error: userTypesError });
                } catch (e) {
                    results.userTypes = { error: e };
                }

                // Test 5: Check permissions table
                try {
                    const { data: permissions, error: permissionsError } = await supabase
                        .from('permissions')
                        .select('*');

                    results.permissions = { data: permissions, error: permissionsError };
                    console.log('Permissions:', { data: permissions, error: permissionsError });
                } catch (e) {
                    results.permissions = { error: e };
                }

                // Test 6: Try to get user permissions
                if (results.profileRLS?.data) {
                    try {
                        const { data: userPermissions, error: userPermissionsError } = await supabase
                            .rpc('get_user_permissions', { _user_id: user.id });

                        results.userPermissions = { data: userPermissions, error: userPermissionsError };
                        console.log('User permissions:', { data: userPermissions, error: userPermissionsError });
                    } catch (e) {
                        results.userPermissions = { error: e };
                    }
                }
            }

            // Test 7: Check RLS policies (commented out due to TypeScript issues)
            results.policies = { data: 'RLS policies check skipped - check Supabase dashboard' };

        } catch (error) {
            results.generalError = error;
            console.error('General error:', error);
        }

        setTestResults(results);
        setIsLoading(false);
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardContent className="space-y-4">

                {Object.keys(testResults).length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Test Results:</h3>

                        {Object.entries(testResults).map(([testName, result]: [string, any]) => (
                            <Card key={testName} className="p-4">
                                <h4 className="font-medium mb-2">{testName}</h4>
                                <div className="text-sm">
                                    {result.error ? (
                                        <div className="text-red-600">
                                            <strong>Error:</strong> {JSON.stringify(result.error, null, 2)}
                                        </div>
                                    ) : result.data ? (
                                        <div className="text-green-600">
                                            <strong>Success:</strong> {JSON.stringify(result.data, null, 2)}
                                        </div>
                                    ) : (
                                        <div className="text-gray-600">
                                            <strong>Result:</strong> {JSON.stringify(result, null, 2)}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 
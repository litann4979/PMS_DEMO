import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import { Head, Link } from '@inertiajs/react';
import { Edit, Car, Phone, Mail, MapPin, ArrowLeft, History, Plus } from 'lucide-react';

export default function ShowCustomer({ customer, stats }: any) {
    return (
        <AppLayout>
            <Head title={`Customer: ${customer.name}`} />
            
            <PageHeader title={customer.name} description={customer.company_name || 'Individual Customer'}>
                <Link href={route('admin.customers.index')} className="mr-2 text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Link>
                <Link href={route('admin.customers.edit', customer.id)} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium inline-flex items-center">
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </Link>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Information Card */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-primary" /> Contact Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Mobile</span>
                            <span className="font-medium">{customer.mobile}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Email</span>
                            <span className="font-medium">{customer.email || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Address</span>
                            <span className="font-medium text-sm">{customer.address || 'No address provided'}</span>
                        </div>
                        <div className="pt-2 border-t">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">GST Number</span>
                            <span className="block font-mono text-sm">{customer.gst_number || 'Not Registered'}</span>
                        </div>
                    </div>
                </div>

                {/* Vehicles List */}
                <div className="lg:col-span-2 bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center">
                            <Car className="w-5 h-5 mr-2 text-primary" /> Assigned Vehicles
                        </h3>

                        <Link href={route('admin.vehicles.create')} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium inline-flex items-center">
                    <Plus className="w-4 h-4 mr-2" />Link New Vehicle
                </Link>
                    </div>
                    <div className="divide-y">
                        {customer.vehicles.length > 0 ? customer.vehicles.map((vehicle: any) => (
                            <div key={vehicle.id} className="p-4 flex justify-between items-center hover:bg-muted/30">
                                <div>
                                    <p className="font-bold text-lg uppercase tracking-tight">{vehicle.vehicle_number}</p>
                                    <p className="text-xs text-muted-foreground">{vehicle.vehicle_type}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${vehicle.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {vehicle.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-muted-foreground italic">
                                No vehicles assigned to this customer.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { electionsApi, Election, ElectionResult } from "@/lib/api/elections";
import { Plus, BarChart3, Clock, CheckCircle2, ChevronRight, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminElectionsPage() {
    const [elections, setElections] = useState<Election[]>([]);
    const [selectedElection, setSelectedElection] = useState<string | null>(null);
    const [results, setResults] = useState<ElectionResult[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadElections() {
            try {
                const data = await electionsApi.getAll();
                setElections(data);
            } catch (err) {
                console.error("Failed to load elections", err);
            } finally {
                setLoading(false);
            }
        }
        loadElections();
    }, []);

    const viewResults = async (id: string) => {
        setLoading(true);
        try {
            const data = await electionsApi.getResults(id);
            setResults(data);
            setSelectedElection(id);
        } catch (err) {
            alert("Failed to load results");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE": return <Badge variant="success">Active</Badge>;
            case "CLOSED": return <Badge variant="neutral">Closed</Badge>;
            case "DRAFT": return <Badge variant="warning">Draft</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Elections & Voting"
                subtitle="Manage student government roles and monitor live election results."
            />

            <div className="flex justify-end mb-4">
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Create Election
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Elections List */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1">All Elections</h3>
                    {loading && elections.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">Loading...</div>
                    ) : elections.length === 0 ? (
                        <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                            No elections found.
                        </div>
                    ) : (
                        elections.map((election) => (
                            <button
                                key={election.id}
                                onClick={() => viewResults(election.id)}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border transition-all hover:shadow-md group",
                                    selectedElection === election.id
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-900 border-gray-100"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold line-clamp-1">{election.title}</div>
                                    {getStatusBadge(election.status)}
                                </div>
                                <div className={cn("text-xs flex items-center gap-1.5", selectedElection === election.id ? "text-gray-400" : "text-gray-500")}>
                                    <Clock className="w-3 h-3" />
                                    Ends {new Date(election.endDate).toLocaleDateString()}
                                </div>
                                <div className="flex justify-end mt-2">
                                    <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", selectedElection === election.id ? "text-white" : "text-gray-300")} />
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Results / Detail Area */}
                <div className="lg:col-span-2">
                    {selectedElection && results ? (
                        <div className="space-y-6">
                            {results.map((pos) => (
                                <Card key={pos.positionName}>
                                    <CardBody>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-black" />
                                            </div>
                                            <h4 className="text-lg font-bold">{pos.positionName}</h4>
                                        </div>

                                        <div className="space-y-6">
                                            {pos.candidates.map((cand) => (
                                                <div key={cand.candidateName} className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <div className="font-medium text-gray-900">{cand.candidateName}</div>
                                                        <div className="text-sm font-bold">{cand.voteCount} votes ({cand.percentage}%)</div>
                                                    </div>
                                                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-black transition-all duration-500 rounded-full"
                                                            style={{ width: `${cand.percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardBody className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                    <BarChart3 className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Select an election to view results</h3>
                                <p className="text-gray-500 max-w-sm">
                                    Click on any election from the list to see real-time voting data and position standings.
                                </p>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
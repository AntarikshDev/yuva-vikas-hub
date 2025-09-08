import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Phone, Send, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
  candidates: any[];
}

export function NotificationDialog({ open, onClose, candidates }: NotificationDialogProps) {
  const [notificationType, setNotificationType] = useState('sms');
  const [recipientType, setRecipientType] = useState('candidates');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Filter candidates based on status
  const filteredCandidates = candidates.filter(candidate => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'migrated') return candidate.migrationStatus === 'Migrated';
    if (statusFilter === 'enrolled') return candidate.enrollmentStatus === 'Enrolled';
    return true;
  });

  // Pre-defined message templates
  const messageTemplates = {
    migrated: "Dear [NAME], congratulations! You have been successfully migrated to [LOCATION] for your job placement with [COMPANY]. Your training will begin soon. For any queries, contact your counselor.",
    enrolled: "Dear [NAME], you have been successfully enrolled in the training program at [LOCATION] with [COMPANY]. Please report to the training center as scheduled. Best wishes for your career journey!",
    custom: ""
  };

  const handleTemplateSelect = (template: string) => {
    setMessage(messageTemplates[template as keyof typeof messageTemplates]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (candidateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates(prev => [...prev, candidateId]);
    } else {
      setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
    }
  };

  const handleSendNotifications = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    if (selectedCandidates.length === 0) {
      toast({
        title: "No Recipients Selected",
        description: "Please select candidates to send notifications to",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const platform = notificationType === 'sms' ? 'SMS' : 'WhatsApp';
      const recipients = recipientType === 'candidates' ? 'candidates' : 'candidates and their parents';
      
      toast({
        title: "Notifications Sent",
        description: `${platform} notifications sent to ${selectedCandidates.length} ${recipients} successfully`,
      });
      
      setSelectedCandidates([]);
      setMessage('');
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={notificationType} onValueChange={setNotificationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          SMS
                        </div>
                      </SelectItem>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Send To</Label>
                  <Select value={recipientType} onValueChange={setRecipientType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidates">Candidates Only</SelectItem>
                      <SelectItem value="both">Candidates & Parents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Candidates</SelectItem>
                      <SelectItem value="migrated">Migrated Only</SelectItem>
                      <SelectItem value="enrolled">Enrolled Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Template */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quick Templates</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect('migrated')}
                    >
                      Migration Success
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect('enrolled')}
                    >
                      Enrollment Confirmation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect('custom')}
                    >
                      Custom Message
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <Textarea
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use [NAME], [COMPANY], and [LOCATION] as placeholders. They will be replaced with actual values.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Select Recipients
                </span>
                <Badge variant="outline">
                  {selectedCandidates.length} of {filteredCandidates.length} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all-notifications"
                    checked={selectedCandidates.length === filteredCandidates.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all-notifications" className="text-sm font-medium">
                    Select All Filtered Candidates
                  </Label>
                </div>

                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {filteredCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedCandidates.includes(candidate.id)}
                            onCheckedChange={(checked) => 
                              handleSelectCandidate(candidate.id, checked as boolean)
                            }
                          />
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {candidate.phone} • {candidate.company} • {candidate.placementLocation}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={candidate.migrationStatus === 'Migrated' ? 'default' : 'secondary'}>
                            {candidate.migrationStatus}
                          </Badge>
                          <Badge variant={candidate.enrollmentStatus === 'Enrolled' ? 'default' : 'secondary'}>
                            {candidate.enrollmentStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {selectedCandidates.length > 0 && message && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Ready to Send</h4>
                    <p className="text-sm text-green-700">
                      {notificationType.toUpperCase()} will be sent to {selectedCandidates.length} {recipientType}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendNotifications}
            disabled={selectedCandidates.length === 0 || !message.trim() || isSending}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? "Sending..." : `Send to ${selectedCandidates.length} Recipients`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
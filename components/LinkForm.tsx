import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface LinkFormProps {
    onSuccess: () => void;
}

export function LinkForm({ onSuccess }: LinkFormProps) {

    const [targetUrl, setTargetUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_url: targetUrl, code: customCode || undefined }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to create link');
                return;
            } 
    
            setSuccess(`Link created: ${window.location.origin}/${data.code}`);
            setTargetUrl('');
            setCustomCode('');
            onSuccess()

        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Error creating link:', err);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg ">
            <h2 className="text-xl font-bold text-gray-800">Create Short Link</h2>
        
            <Input
                label="Target URL *"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className='text-gray-600'
                required
            />

            <Input
                label="Custom Code (optional)"
                type="text"
                placeholder="mycode (6-8 characters)"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                pattern="[A-Za-z0-9]{6,8}"
                title="6-8 alphanumeric characters"
                className='text-gray-600'
                />

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                    <p className="text-sm text-teal-600">{success}</p>
                </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
                Create Link
            </Button>
        </form>
    );
}
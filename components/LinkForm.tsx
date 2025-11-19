import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { isValidUrl, isValidCode } from '@/lib/validation';

interface LinkFormProps {
    onSuccess: () => void;
}

export function LinkForm({ onSuccess }: LinkFormProps) {

    const [targetUrl, setTargetUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [urlError, setUrlError] = useState('');
    const [codeError, setCodeError] = useState('');

    const handleUrlBlur = () => {
        if (targetUrl && !isValidUrl(targetUrl)) {
            setUrlError('Please enter a valid URL starting with http:// or https://');
        } else {
            setUrlError('');
        }
    };

    const handleCodeBlur = () => {
    if (customCode && !isValidCode(customCode)) {
      setCodeError('Code must be 6-8 alphanumeric characters (A-Z, a-z, 0-9)');
    } else {
      setCodeError('');
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // trim values for validation/submission
        const trimmedUrl = targetUrl.trim();
        const trimmedCode = customCode.trim();

        // Client-side validation (run BEFORE enabling loading)
        if (!trimmedUrl) {
            setError('Please enter a target URL');
            setUrlError('Please enter a target URL');
            return;
        }

        if (!isValidUrl(trimmedUrl)) {
            setError('Please enter a valid URL starting with http:// or https://');
            setUrlError('Please enter a valid URL starting with http:// or https://');
            return;
        }

        if (trimmedCode && !isValidCode(trimmedCode)) {
            setError('Custom code must be 6-8 alphanumeric characters');
            setCodeError('Custom code must be 6-8 alphanumeric characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_url: trimmedUrl, code: trimmedCode || undefined }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to create link');
                return;
            } 
    
            setSuccess(`Link created: ${window.location.origin}/${data.code}`);
            setTargetUrl('');
            setCustomCode('');
            setTimeout(() => {
                onSuccess();
                setSuccess('');
            }, 1500);

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
                onChange={(e) => {
                  setTargetUrl(e.target.value);
                  if (urlError) setUrlError('');
                  if (error) setError('');
                }}
                onBlur={handleUrlBlur}
                className='text-gray-600'
                required
                error={urlError}
            />

            <Input
                label="Custom Code (optional)"
                type="text"
                placeholder="mycode (6-8 characters)"
                value={customCode}
                onChange={(e) => {
                  setCustomCode(e.target.value);
                  if (codeError) setCodeError('');
                  if (error) setError('');
                }}
                onBlur={handleCodeBlur}
                error={codeError}
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

             <Button 
                type="submit" 
                isLoading={isLoading} 
                disabled={isLoading || !!urlError || !!codeError}
                className="w-full"
            >
                {isLoading ? 'Creating...' : 'Create Link'}
            </Button>
        </form>
    );
}
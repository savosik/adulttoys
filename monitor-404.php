#!/usr/bin/env php
<?php

/**
 * Simple 404 Error Monitor Script
 * Logs 404 errors to a file for SEO monitoring
 * 
 * Usage: php monitor-404.php
 */

require_once __DIR__.'/../vendor/autoload.php';

use Illuminate\Http\Request;

class ErrorMonitor
{
    private $logFile;
    private $errorLog;

    public function __construct()
    {
        $this->logFile = storage_path('logs/404-monitor.log');
        $this->errorLog = storage_path('logs/laravel.log');
    }

    /**
     * Monitor 404 errors from Laravel logs
     */
    public function monitor404Errors()
    {
        if (!file_exists($this->errorLog)) {
            echo "Log file not found: {$this->errorLog}\n";
            return;
        }

        $content = file_get_contents($this->errorLog);
        $lines = explode("\n", $content);
        
        $fourOhFours = [];
        $today = date('Y-m-d');
        
        foreach ($lines as $line) {
            if (strpos($line, '404') !== false && strpos($line, $today) !== false) {
                // Extract URL from log line
                if (preg_match('/GET\s+(\/[^\s]*)/', $line, $matches)) {
                    $url = $matches[1];
                    if (!isset($fourOhFours[$url])) {
                        $fourOhFours[$url] = 0;
                    }
                    $fourOhFours[$url]++;
                }
            }
        }

        if (!empty($fourOhFours)) {
            $report = "=== 404 Errors Report - {$today} ===\n";
            foreach ($fourOhFours as $url => $count) {
                $report .= "{$url}: {$count} times\n";
            }
            $report .= "\n";

            file_put_contents($this->logFile, $report, FILE_APPEND);
            echo "Found " . count($fourOhFours) . " unique 404 errors today.\n";
            echo "Report saved to: {$this->logFile}\n";
        } else {
            echo "No 404 errors found today.\n";
        }
    }

    /**
     * Check for broken internal links
     */
    public function checkBrokenLinks()
    {
        echo "Checking for broken internal links...\n";
        
        // This would require parsing HTML content and checking links
        // For now, we'll just log the intention
        $report = "=== Broken Link Check - " . date('Y-m-d H:i:s') . " ===\n";
        $report .= "Feature not yet implemented. Would check:\n";
        $report .= "- Internal navigation links\n";
        $report .= "- Product/category links\n";
        $report .= "- Image URLs\n\n";
        
        file_put_contents($this->logFile, $report, FILE_APPEND);
        echo "Broken link check logged (feature pending).\n";
    }

    /**
     * Generate summary report
     */
    public function generateSummary()
    {
        if (!file_exists($this->logFile)) {
            echo "No monitoring data available.\n";
            return;
        }

        $content = file_get_contents($this->logFile);
        echo "\n=== 404 Monitoring Summary ===\n";
        echo substr($content, -1000); // Last 1000 chars
    }
}

// Run the monitor
if (php_sapi_name() === 'cli') {
    $monitor = new ErrorMonitor();
    
    echo "Starting SEO Error Monitoring...\n";
    
    $monitor->monitor404Errors();
    $monitor->checkBrokenLinks();
    $monitor->generateSummary();
    
    echo "\nMonitoring complete.\n";
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'This script must be run from command line']);
}

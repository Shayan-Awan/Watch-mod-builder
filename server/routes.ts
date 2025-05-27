import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve HTML files from the root directory
  const htmlFiles = [
    'homepage.html',
    'parts-catalog.html', 
    'suppliers.html',
    'outfit-creator.html',
    'upload-outfit.html',
    'jewelry-designer.html',
    'chain-and-box-designer.html',
    'community-forum.html',
    'navigation.html'
  ];

  // Route each HTML file
  htmlFiles.forEach(filename => {
    const routePath = `/${filename}`;
    app.get(routePath, (req, res) => {
      const filePath = path.join(process.cwd(), filename);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send('File not found');
      }
    });
  });

  // API route to save watch configurations
  app.post("/api/watch-config", async (req, res) => {
    try {
      const { name, config } = req.body;
      
      if (!name || !config) {
        return res.status(400).json({ message: "Name and configuration are required" });
      }
      
      // In a real implementation, you would save this to a database
      // For now, we'll just return a success message
      res.status(201).json({ 
        message: "Configuration saved successfully", 
        id: Date.now().toString() 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to save configuration" });
    }
  });
  
  // API route to get watch configuration by ID
  app.get("/api/watch-config/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // In a real implementation, you would fetch from a database
      // For now, we'll return a 404
      res.status(404).json({ message: "Configuration not found" });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  HelpCircle,
  Check,
  X,
  Move
} from 'lucide-react';

interface Question {
  id: number;
  lesson_id: number;
  question: string;
  question_image?: string;
  question_type: 'mcq';
  options: { text: string; image?: string }[];
  correct_answer: string;
  explanation: string;
  points: number;
  orderBy: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  isErased: boolean;
}

interface Lesson {
  id: number;
  title: string;
  course_id: number;
}

interface Course {
  id: number;
  title: string;
}

const questionTypeLabels = {
  mcq: 'Multiple Choice'
};

const getQuestionTypeColor = (type: string) => {
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
};

export default function QuestionsPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    question: '',
    question_image: '',
    question_type: 'mcq' as Question['question_type'],
    options: [
      { text: '', image: '' },
      { text: '', image: '' },
      { text: '', image: '' },
      { text: '', image: '' }
    ],
    correct_answer: '',
    explanation: '',
    points: 1,
    orderBy: 0
  });

  // Mock data (replace with API calls)
  useEffect(() => {
    // Mock course data
    setCourse({ id: Number(courseId), title: 'Introduction to React' });

    // Mock lesson data  
    setLesson({ id: Number(lessonId), title: 'React Hooks', course_id: Number(courseId) });

    // Mock questions data
    const mockQuestions: Question[] = [
      {
        id: 1,
        lesson_id: Number(lessonId),
        question: 'What is useState in React?',
        question_type: 'mcq',
        options: [
          { text: 'A state management hook' },
          { text: 'A lifecycle method' },
          { text: 'A component' },
          { text: 'A prop' }
        ],
        correct_answer: 'A state management hook',
        explanation: 'useState is a React Hook that lets you add state to functional components.',
        points: 2,
        orderBy: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 1,
        updatedBy: 1,
        isErased: false
      }
    ];

    setQuestions(mockQuestions);

    // Set next order
    const maxOrder = Math.max(...mockQuestions.map(q => q.orderBy), 0);
    setFormData(prev => ({ ...prev, orderBy: maxOrder + 1 }));
  }, [courseId, lessonId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingQuestion) {
      // Update question
      setQuestions(prev => prev.map(q =>
        q.id === editingQuestion.id
          ? {
            ...q,
            ...formData,
            options: formData.options.filter(opt => opt.text.trim() !== ''),
            updatedAt: new Date().toISOString()
          }
          : q
      ));
      toast({ title: "Question updated successfully" });
    } else {
      // Create new question
      const newQuestion: Question = {
        id: Date.now(),
        lesson_id: Number(lessonId),
        ...formData,
        options: formData.options.filter(opt => opt.text.trim() !== ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 1,
        updatedBy: 1,
        isErased: false
      };

      setQuestions(prev => [...prev, newQuestion]);

      // Set next order for new questions
      const maxOrder = Math.max(...questions.map(q => q.orderBy), formData.orderBy);
      setFormData(prev => ({ ...prev, orderBy: maxOrder + 1 }));

      toast({ title: "Question created successfully" });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    const paddedOptions = [
      ...question.options.map(opt => ({ text: opt.text, image: opt.image || '' })),
      { text: '', image: '' },
      { text: '', image: '' },
      { text: '', image: '' },
      { text: '', image: '' }
    ].slice(0, 4);

    setFormData({
      question: question.question,
      question_image: question.question_image || '',
      question_type: question.question_type,
      options: paddedOptions,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      points: question.points,
      orderBy: question.orderBy
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, isErased: true } : q
    ));
    toast({ title: "Question deleted successfully" });
  };

  const resetForm = () => {
    setEditingQuestion(null);
    const maxOrder = Math.max(...questions.map(q => q.orderBy), 0);
    setFormData({
      question: '',
      question_image: '',
      question_type: 'mcq',
      options: [
        { text: '', image: '' },
        { text: '', image: '' },
        { text: '', image: '' },
        { text: '', image: '' }
      ],
      correct_answer: '',
      explanation: '',
      points: 1,
      orderBy: maxOrder + 1
    });
  };

  const handleOptionChange = (index: number, field: 'text' | 'image', value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };


  // Filter questions
  const filteredQuestions = questions
    .filter(q => !q.isErased)
    .filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || q.question_type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => a.orderBy - b.orderBy);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/admin/courses/${courseId}/lessons`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lessons
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Manage Questions</h1>
              <p className="text-muted-foreground">
                {course?.title} → {lesson?.title}
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingQuestion ? 'Edit Question' : 'Create New Question'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Type */}
                <div className="space-y-2">
                  <Label htmlFor="question_type">Question Type</Label>
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Multiple Choice Questions</span>
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question Text</Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter your question..."
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question_image">Question Image (Optional)</Label>
                    <Input
                      id="question_image"
                      type="url"
                      value={formData.question_image}
                      onChange={(e) => setFormData(prev => ({ ...prev, question_image: e.target.value }))}
                      placeholder="Enter image URL..."
                    />
                    {formData.question_image && (
                      <div className="mt-2">
                        <img
                          src={formData.question_image}
                          alt="Question preview"
                          className="max-w-xs rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Answer Options */}
                <div className="space-y-4">
                  <Label>Answer Options</Label>
                  <div className="space-y-4">
                    {formData.options.map((option, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-medium">Option {String.fromCharCode(65 + index)}</span>
                        </div>

                        <div className="space-y-2">
                          <Label>Option Text</Label>
                          <Input
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                            placeholder={`Enter option ${String.fromCharCode(65 + index)} text...`}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Option Image (Optional)</Label>
                          <Input
                            type="url"
                            value={option.image || ''}
                            onChange={(e) => handleOptionChange(index, 'image', e.target.value)}
                            placeholder="Enter image URL..."
                          />
                          {option.image && (
                            <div className="mt-2">
                              <img
                                src={option.image}
                                alt={`Option ${String.fromCharCode(65 + index)} preview`}
                                className="max-w-xs rounded-lg border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer Selection */}
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <RadioGroup
                    value={formData.correct_answer}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, correct_answer: value }))}
                  >
                    {formData.options
                      .filter(opt => opt.text.trim() !== '')
                      .map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.text} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option.text}</span>
                            {option.image && (
                              <img
                                src={option.image}
                                alt="Option preview"
                                className="w-8 h-8 object-cover rounded border ml-2"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </Label>
                        </div>
                      ))
                    }
                  </RadioGroup>
                </div>


                {/* Explanation */}
                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Explain why this is the correct answer..."
                    rows={2}
                  />
                </div>

                {/* Points and Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={formData.points}
                      onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderBy">Order</Label>
                    <Input
                      id="orderBy"
                      type="number"
                      min="1"
                      value={formData.orderBy}
                      onChange={(e) => setFormData(prev => ({ ...prev, orderBy: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingQuestion ? 'Update Question' : 'Create Question'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="mcq">Multiple Choice</SelectItem>
              <SelectItem value="true_false">True/False</SelectItem>
              <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
              <SelectItem value="essay">Essay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Questions ({filteredQuestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <HelpCircle className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No questions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuestions.map((question) => (
                      <TableRow key={question.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {question.orderBy}
                            </Badge>
                            <Move className="w-4 h-4 text-muted-foreground cursor-move" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-sm">
                            <p className="font-medium line-clamp-2">{question.question}</p>
                            {question.explanation && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {question.explanation}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getQuestionTypeColor(question.question_type)}>
                            {questionTypeLabels[question.question_type]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">
                              {question.correct_answer}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{question.points} pts</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border">
                              <DropdownMenuItem onClick={() => handleEdit(question)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Question
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(question.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Question
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}